import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Siswa } from '../../types';
import {
  GraduationCap,
  Users,
  Search,
  Plus,
  FileSpreadsheet,
  Download,
  Upload,
  Eye,
  Edit2,
  Trash2,
  Utensils,
  X,
  Check,
  Award,
  AlertTriangle,
  Camera,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { ImageUploader } from '../common/ImageUploader';
import { KartuKendaliModal } from '../common/KartuKendaliModal';
import { exportToXLSX, readXLSXFile, downloadSiswaTemplateXLSX } from '../../utils/excelHelper';

export const DataSiswaView: React.FC = () => {
  const { siswaList, kelasList, addSiswa, updateSiswa, deleteSiswa, confirmAction, alertSuccess, alertInfo, setActiveView } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [kelasFilter, setKelasFilter] = useState<string>('Semua');
  const [genderFilter, setGenderFilter] = useState<string>('Semua');
  const [mbgFilter, setMbgFilter] = useState<string>('Semua');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showKartuKendaliModal, setShowKartuKendaliModal] = useState(false);
  const [kartuKendaliSiswa, setKartuKendaliSiswa] = useState<Siswa | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importFileName, setImportFileName] = useState<string | null>(null);
  const [importedRows, setImportedRows] = useState<any[]>([]);
  const [selectedSiswa, setSelectedSiswa] = useState<Siswa | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form data
  const [formData, setFormData] = useState<any>({
    nis: '',
    nisn: '',
    nama: '',
    kelas: 'X A',
    jenisKelamin: 'Laki-laki',
    noHpWali: '',
    namaWali: '',
    status: 'Aktif',
    penerimaMBG: true,
    poinPelanggaran: 0
  });

  const filteredSiswa = siswaList.filter((s: any) => {
    const matchSearch =
      s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nis.includes(searchTerm) ||
      (s.nisn || '').includes(searchTerm);
    const matchKelas = kelasFilter === 'Semua' ? true : s.kelas === kelasFilter;
    const isMale = s.jenisKelamin === 'L' || s.jenisKelamin === 'Laki-laki';
    const matchGender =
      genderFilter === 'Semua'
        ? true
        : genderFilter === 'L'
        ? isMale
        : !isMale;
    const matchMbg =
      mbgFilter === 'Semua'
        ? true
        : mbgFilter === 'MBG'
        ? !!s.penerimaMBG
        : !s.penerimaMBG;
    const matchStatus =
      statusFilter === 'Semua'
        ? true
        : statusFilter === 'Aktif'
        ? (s.status === 'Aktif' || !s.status)
        : statusFilter === 'Lulus'
        ? (s.status === 'Lulus' || (s.kelas && s.kelas.includes('Alumni')))
        : s.status === statusFilter;
    return matchSearch && matchKelas && matchGender && matchMbg && matchStatus;
  });

  const totalSiswa = siswaList.length;
  const siswaL = siswaList.filter((s: any) => s.jenisKelamin === 'L' || s.jenisKelamin === 'Laki-laki').length;
  const siswaP = totalSiswa - siswaL;
  const totalMbg = siswaList.filter((s: any) => s.penerimaMBG !== false).length;

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({
      nis: '',
      nisn: '',
      nama: '',
      kelas: kelasList[0]?.nama || 'X - IPA 1',
      jenisKelamin: 'L',
      noHpWali: '',
      namaWali: '',
      status: 'Aktif',
      penerimaMBG: true,
      poinPelanggaran: 0
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (siswa: Siswa) => {
    setIsEditing(true);
    setFormData({ ...siswa });
    setShowAddModal(true);
  };

  const handleSaveSiswa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama) return;

    if (isEditing && formData.id) {
      updateSiswa(formData.id, formData);
      alertSuccess('Data Siswa Diperbarui', `Data peserta didik ${formData.nama} berhasil diperbarui.`);
    } else {
      const defaultFoto = formData.jenisKelamin === 'P' || formData.jenisKelamin === 'Perempuan'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
        : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200';

      const newSiswa: Siswa = {
        id: `s-${Date.now()}`,
        nis: formData.nis || `${Math.floor(1000 + Math.random() * 9000)}`,
        nisn: formData.nisn || `008${Math.floor(1000000 + Math.random() * 9000000)}`,
        nama: formData.nama || '',
        kelas: formData.kelas || 'X - IPA 1',
        jenisKelamin: (formData.jenisKelamin as 'L' | 'P') || 'L',
        noHpWali: formData.noHpWali || '-',
        namaWali: formData.namaWali || 'Wali Santri',
        status: (formData.status as any) || 'Aktif',
        penerimaMBG: formData.penerimaMBG !== undefined ? formData.penerimaMBG : true,
        poinPelanggaran: formData.poinPelanggaran || 0,
        foto: formData.foto || defaultFoto
      } as any;
      addSiswa(newSiswa);
      alertSuccess('Siswa Ditambahkan', `Peserta didik ${newSiswa.nama} berhasil didaftarkan ke kelas ${newSiswa.kelas}.`);
    }
    setShowAddModal(false);
  };

  const handleExportXLSX = () => {
    const headers = [
      'No',
      'NIS',
      'NISN',
      'Nama Lengkap Santri',
      'Kelas',
      'Jenis Kelamin',
      'Status Siswa',
      'Penerima MBG',
      'Poin Pelanggaran',
      'Nama Orang Tua / Wali',
      'Nomor WhatsApp Wali'
    ];
    const rows = filteredSiswa.map((s: any, idx: number) => [
      idx + 1,
      s.nis || '-',
      s.nisn || '-',
      s.nama,
      s.kelas,
      s.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan',
      s.status,
      s.penerimaMBG ? 'Ya' : 'Tidak',
      s.poinPelanggaran || 0,
      s.namaWali || '-',
      s.noHpWali || '-'
    ]);

    exportToXLSX({
      filename: `Data_Siswa_MAPLUS_${new Date().toISOString().slice(0, 10)}.xlsx`,
      sheetName: 'Data Siswa',
      headers,
      data: rows,
      colWidths: [8, 18, 18, 30, 14, 16, 14, 16, 18, 26, 20]
    });

    alertSuccess(
      'Ekspor Excel Berhasil',
      'Data seluruh peserta didik berhasil diekspor ke format Excel (.xlsx) dengan kolom sel terpisah rapi.'
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
        alertInfo('File Kosong', 'File Excel tidak memuat baris data peserta didik.');
        setImportLoading(false);
        return;
      }

      // Skip header row, map remaining data rows
      const dataRows = rows.slice(1);
      const parsedSiswa: Partial<Siswa>[] = [];

      dataRows.forEach((row, i) => {
        if (!row || row.length === 0) return;
        // Check if row has a 'No' column in index 0
        const isFirstColNumber = !isNaN(Number(row[0])) && String(row[0]).trim() !== '' && row.length > 3;
        const colOffset = isFirstColNumber ? 1 : 0;

        // Headers: No, NIS, NISN, Nama, JK, Kelas, Program, MBG, Ortu, NoHP
        const nis = String(row[colOffset] || `2026${1000 + i}`).trim();
        const nisn = String(row[colOffset + 1] || '').trim();
        const nama = String(row[colOffset + 2] || row[colOffset] || '').trim();
        if (!nama || nama.toLowerCase() === 'nama' || nama.toLowerCase() === 'nama lengkap') return;

        const jkRaw = String(row[colOffset + 3] || 'L').toUpperCase();
        const jenisKelamin = jkRaw.startsWith('P') || jkRaw.includes('PEREMPUAN') ? 'P' : 'L';
        const kelas = String(row[colOffset + 4] || 'XA').trim();
        const mbgRaw = String(row[colOffset + 6] || row[colOffset + 5] || 'Ya').toLowerCase();
        const penerimaMBG = mbgRaw.includes('ya') || mbgRaw.includes('true') || mbgRaw.includes('1');
        const namaWali = String(row[colOffset + 7] || '').trim();
        const noHpWali = String(row[colOffset + 8] || '').trim();

        parsedSiswa.push({
          id: `s-imp-${Date.now()}-${i}`,
          nama,
          nis,
          nisn: nisn || undefined,
          jenisKelamin: jenisKelamin as any,
          kelas: kelas || 'XA',
          penerimaMBG,
          namaWali: namaWali || undefined,
          noHpWali: noHpWali || undefined,
          status: 'Aktif',
          poinPelanggaran: 0,
          avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150'
        });
      });

      setImportedRows(parsedSiswa);
      alertSuccess('File Excel Terbaca', `Berhasil membaca ${parsedSiswa.length} data santri dari file .xlsx dengan kolom sel terpisah rapi.`);
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
    importedRows.forEach(s => {
      addSiswa(s as Siswa);
    });
    alertSuccess('Impor Berhasil', `${importedRows.length} data peserta didik berhasil diimpor dari file .xlsx dan disinkronkan ke daftar absensi.`);
    setImportedRows([]);
    setImportFileName(null);
    setShowImportModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">{totalSiswa}</div>
              <div className="text-xs text-slate-500 font-medium">Total Peserta Didik</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-50 text-cyan-700 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-700">{siswaL}</div>
              <div className="text-xs text-slate-500 font-medium">Santri Laki-laki (Putra)</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-pink-50 text-pink-700 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-600">{siswaP}</div>
              <div className="text-xs text-slate-500 font-medium">Santri Perempuan (Putri)</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">{totalMbg}</div>
              <div className="text-xs text-slate-500 font-medium">Penerima Manfaat MBG</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama siswa, NIS, NISN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Filter Kelas */}
          <select
            value={kelasFilter}
            onChange={(e) => setKelasFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="Semua">Semua Rombel/Kelas</option>
            {kelasList.map((k) => (
              <option key={k.id} value={k.nama}>
                {k.nama}
              </option>
            ))}
          </select>

          {/* Gender */}
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="Semua">Semua L/P</option>
            <option value="L">Laki-laki (Putra)</option>
            <option value="P">Perempuan (Putri)</option>
          </select>

          {/* MBG */}
          <select
            value={mbgFilter}
            onChange={(e) => setMbgFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="Semua">Semua MBG</option>
            <option value="MBG">Penerima MBG</option>
            <option value="Non-MBG">Bukan MBG</option>
          </select>

          {/* Status Siswa */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-blue-500 font-medium"
          >
            <option value="Semua">Semua Status</option>
            <option value="Aktif">Santri Aktif</option>
            <option value="Lulus">Lulus (Alumni)</option>
            <option value="Tinggal">Tinggal Kelas</option>
            <option value="Mutasi">Mutasi / Pindah</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveView('pergantian-tahun')}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-white bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 rounded-lg transition-all shadow-xs cursor-pointer"
            title="Kelola Pergantian Tahun Ajaran, Kenaikan Kelas & Kelulusan Siswa"
          >
            <RotateCcw className="w-4 h-4 text-emerald-200" />
            <span>Kenaikan &amp; Kelulusan</span>
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            Import Siswa
          </button>
          <button
            onClick={() => {
              setKartuKendaliSiswa(filteredSiswa[0] || siswaList[0] || null);
              setShowKartuKendaliModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors cursor-pointer"
            title="Buka & Cetak Kartu Kendali Santri Berkop Resmi"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            Kartu Kendali
          </button>
          <button
            onClick={handleExportXLSX}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            + Tambah Siswa
          </button>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="font-semibold text-slate-800">
            Daftar Peserta Didik MA PLUS ({filteredSiswa.length} Siswa Terdaftar)
          </div>
          <span className="text-xs text-slate-500">Integrasi Porsi MBG & Ketertiban Madrasah</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama Santri & NISN</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4 text-center">L/P</th>
                <th className="py-3 px-4">Wali Santri & Telepon</th>
                <th className="py-3 px-4 text-center">MBG</th>
                <th className="py-3 px-4 text-center">Poin Tatib</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSiswa.map((siswa: any, idx: number) => {
                const isMale = siswa.jenisKelamin === 'L' || siswa.jenisKelamin === 'Laki-laki';
                const poin = siswa.poinPelanggaran || siswa.pelanggaranCount || 0;
                return (
                  <tr key={siswa.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center text-slate-400 font-medium">{idx + 1}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{siswa.nama}</div>
                      <div className="text-xs text-slate-400">
                        NIS: {siswa.nis} • NISN: {siswa.nisn || siswa.nis}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{siswa.kelas}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                        isMale ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                      }`}>
                        {isMale ? 'Putra' : 'Putri'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-xs text-slate-700 font-medium">{siswa.namaWali || 'Wali Santri'}</div>
                      <div className="text-xs text-slate-400">{siswa.noHpWali || '-'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {siswa.penerimaMBG !== false ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                          <Utensils className="w-3 h-3" />
                          Penerima
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Bukan</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                        poin > 20
                          ? 'bg-rose-100 text-rose-700'
                          : poin > 0
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {poin} Poin
                      </span>
                    </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      siswa.status === 'Lulus'
                        ? 'bg-purple-100 text-purple-800 border border-purple-200'
                        : siswa.status === 'Tinggal'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : siswa.status === 'Mutasi / Keluar' || siswa.status === 'Mutasi'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {siswa.status || 'Aktif'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => {
                          setKartuKendaliSiswa(siswa);
                          setShowKartuKendaliModal(true);
                        }}
                        title={`Cetak Kartu Kendali ${siswa.nama}`}
                        className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      </button>
                      <button
                        onClick={() => setSelectedSiswa(siswa)}
                        title="Lihat Detail Siswa"
                        className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(siswa)}
                        title="Edit Data Siswa"
                        className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          confirmAction({
                            isDanger: true,
                            title: 'Hapus Data Siswa',
                            message: `Apakah Anda yakin ingin menghapus data siswa "${siswa.nama}" (${siswa.kelas})?\n\nRiwayat absensi dan poin pelanggaran siswa ini akan dihapus.`,
                            confirmText: 'Ya, Hapus Siswa',
                            onConfirm: () => {
                              deleteSiswa(siswa.id);
                              alertSuccess('Data Siswa Dihapus', `Data santri/siswa ${siswa.nama} berhasil dihapus.`);
                            }
                          });
                        }}
                        title="Hapus Data Siswa"
                        className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredSiswa.length === 0 && (
              <tr>
                <td colSpan={9} className="py-12 px-4 text-center">
                  <div className="max-w-md mx-auto flex flex-col items-center justify-center text-slate-500">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 border border-emerald-200 shadow-xs">
                      <GraduationCap className="w-7 h-7" />
                    </div>
                    <h4 className="text-base font-bold text-slate-800 mb-1">
                      Belum Ada Data Santri / Peserta Didik
                    </h4>
                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                      Seluruh data dummy telah dibersihkan. Sistem siap untuk penginputan mandiri secara aman melalui formulir manual atau impor Excel.
                    </p>
                    <div className="flex items-center gap-2.5 flex-wrap justify-center">
                      <button
                        type="button"
                        onClick={handleOpenAdd}
                        className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        Tambah Santri Pertama
                      </button>
                      <button
                        type="button"
                        onClick={downloadSiswaTemplateXLSX}
                        className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        Unduh Template Excel
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Siswa */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-bold text-slate-800">
                {isEditing ? 'Edit Data Peserta Didik' : 'Tambah Peserta Didik Baru'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSiswa} className="space-y-4">
              {/* Photo Uploader */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <ImageUploader
                  currentImage={formData.foto || formData.avatarUrl}
                  onImageChange={(imgUrl) => setFormData({ ...formData, foto: imgUrl, avatarUrl: imgUrl })}
                  label="Foto Profil Peserta Didik"
                  sublabel="Unggah foto santri atau pilih preset. Foto dapat diubah sewaktu-waktu."
                  shape="circle"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor Induk Santri (NIS) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 20241001"
                    value={formData.nis || ''}
                    onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NISN Nasional
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 0081234567"
                    value={formData.nisn || ''}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Siswa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ahmad Fauzan"
                  value={formData.nama || ''}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kelas / Rombel
                  </label>
                  <select
                    value={formData.kelas}
                    onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    {kelasList.map((k) => (
                      <option key={k.id} value={k.nama}>
                        {k.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={formData.jenisKelamin}
                    onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="L">Laki-laki (Putra)</option>
                    <option value="P">Perempuan (Putri)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Orang Tua / Wali
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Bpk. H. Mulyadi"
                    value={formData.namaWali || ''}
                    onChange={(e) => setFormData({ ...formData, namaWali: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    No. WhatsApp Wali
                  </label>
                  <input
                    type="text"
                    placeholder="081234567890"
                    value={formData.noHpWali || ''}
                    onChange={(e) => setFormData({ ...formData, noHpWali: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <input
                  type="checkbox"
                  id="penerimaMbgCheck"
                  checked={formData.penerimaMBG}
                  onChange={(e) => setFormData({ ...formData, penerimaMBG: e.target.checked })}
                  className="rounded text-blue-700 focus:ring-blue-500"
                />
                <label htmlFor="penerimaMbgCheck" className="text-xs font-semibold text-amber-900 cursor-pointer">
                  Termasuk Daftar Penerima Makan Bergizi Gratis (MBG)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  {isEditing ? 'Simpan Perubahan' : 'Tambahkan Siswa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Drawer Detail Siswa */}
      {selectedSiswa && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h4 className="font-bold text-slate-800">Detail Rekam Jejak Siswa</h4>
                <button
                  onClick={() => setSelectedSiswa(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center space-y-2">
                <div className="relative inline-block mx-auto">
                  {(selectedSiswa as any).foto || (selectedSiswa as any).avatarUrl ? (
                    <img
                      src={(selectedSiswa as any).foto || (selectedSiswa as any).avatarUrl}
                      alt={selectedSiswa.nama}
                      className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-emerald-100 shadow-sm"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-emerald-50 border-2 border-emerald-200 text-emerald-800 rounded-full flex items-center justify-center font-bold text-2xl mx-auto shadow-sm">
                      {selectedSiswa.nama.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <label
                    title="Ganti Foto Santri"
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
                              updateSiswa(selectedSiswa.id, { foto: newFoto, avatarUrl: newFoto } as any);
                              setSelectedSiswa(prev => prev ? { ...prev, foto: newFoto, avatarUrl: newFoto } as any : null);
                              alertSuccess('Foto Santri Diperbarui', `Foto profil ${selectedSiswa.nama} berhasil diubah.`);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mt-2">{selectedSiswa.nama}</h3>
                <p className="text-xs text-slate-500">Kelas: {selectedSiswa.kelas}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">NIS:</span>
                  <span className="font-semibold text-slate-700">{selectedSiswa.nis}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">NISN:</span>
                  <span className="font-semibold text-slate-700">{(selectedSiswa as any).nisn || selectedSiswa.nis}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Jenis Kelamin:</span>
                  <span className="font-semibold text-slate-700">
                    {selectedSiswa.jenisKelamin === 'L' || selectedSiswa.jenisKelamin === 'Laki-laki' ? 'Laki-laki (Putra)' : 'Perempuan (Putri)'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Wali Santri:</span>
                  <span className="font-semibold text-slate-700">{selectedSiswa.namaWali || 'Wali Santri'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">No. WhatsApp Wali:</span>
                  <span className="font-semibold text-blue-600">{selectedSiswa.noHpWali || '-'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Status MBG:</span>
                  <span className="font-semibold text-amber-700">
                    {(selectedSiswa as any).penerimaMBG !== false ? 'Penerima Porsi MBG' : 'Bukan Penerima'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Poin Pelanggaran:</span>
                  <span className="font-bold text-rose-600">
                    {(selectedSiswa as any).poinPelanggaran || selectedSiswa.pelanggaranCount || 0} Poin
                  </span>
                </div>
              </div>

              {/* Attendance & Violations Summary */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Riwayat Ketertiban Bulan Ini
                </h5>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-lg text-emerald-800">
                    <span>Tingkat Kehadiran:</span>
                    <span className="font-bold">98.5% (Hadir Prima)</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-blue-50 rounded-lg text-blue-800">
                    <span>Status Tugas Khusus:</span>
                    <span className="font-bold">Anggota Tim MBG</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
              <button
                onClick={() => {
                  setKartuKendaliSiswa(selectedSiswa);
                  setShowKartuKendaliModal(true);
                }}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>Cetak Kartu Kendali Santri</span>
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedSiswa(null);
                    handleOpenEdit(selectedSiswa);
                  }}
                  className="flex-1 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-semibold cursor-pointer"
                >
                  Edit Data
                </button>
                <button
                  onClick={() => setSelectedSiswa(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-50 cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Import Siswa */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-800">Import Data Siswa (.xlsx)</h3>
                <p className="text-xs text-slate-500">Impor data santri/siswa langsung dari tabel Excel</p>
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
                  <span className="font-semibold text-emerald-600">✓ {importedRows.length} data santri terdeteksi dalam sel kolom terpisah</span>
                ) : (
                  'Format standar .xlsx dengan kolom sel mandiri (A: NIS, B: NISN, C: Nama Santri, D: JK, E: Kelas, F: MBG)'
                )}
              </div>
            </label>

            {/* Live Preview Table of Discrete Student Cells */}
            {importedRows.length > 0 && (
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200 text-[11px] font-bold text-slate-700 flex items-center justify-between">
                  <span>Pratinjau Sel Kolom Terpisah ({importedRows.length} santri):</span>
                  <span className="text-emerald-700 text-[10px] bg-emerald-100/70 px-2 py-0.5 rounded-full font-semibold">Tersusun Rapi per Kolom</span>
                </div>
                <div className="max-h-36 overflow-y-auto">
                  <table className="w-full text-[11px] text-left border-collapse">
                    <thead className="bg-slate-200/70 text-slate-600 text-[10px]">
                      <tr>
                        <th className="p-1.5 border-r border-slate-300">Kolom A (NIS)</th>
                        <th className="p-1.5 border-r border-slate-300">Kolom B (NISN)</th>
                        <th className="p-1.5 border-r border-slate-300">Kolom C (Nama Santri)</th>
                        <th className="p-1.5 border-r border-slate-300">Kolom D (JK)</th>
                        <th className="p-1.5 border-r border-slate-300">Kolom E (Kelas)</th>
                        <th className="p-1.5">Kolom F (MBG)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {importedRows.slice(0, 4).map((s, idx) => (
                        <tr key={idx} className="hover:bg-emerald-50/40">
                          <td className="p-1.5 font-mono text-slate-700 border-r border-slate-200">{s.nis}</td>
                          <td className="p-1.5 font-mono text-slate-500 border-r border-slate-200">{s.nisn || '-'}</td>
                          <td className="p-1.5 font-medium text-slate-800 border-r border-slate-200">{s.nama}</td>
                          <td className="p-1.5 text-slate-600 border-r border-slate-200">{s.jenisKelamin}</td>
                          <td className="p-1.5 text-slate-600 border-r border-slate-200">{s.kelas}</td>
                          <td className="p-1.5 text-slate-600">
                            {s.penerimaMBG ? (
                              <span className="text-emerald-700 font-semibold">Ya</span>
                            ) : (
                              <span className="text-slate-400">Tidak</span>
                            )}
                          </td>
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
                  downloadSiswaTemplateXLSX();
                  alertSuccess('Template Diunduh', 'File format Template_Import_Data_Siswa_MAPLUS.xlsx berhasil diunduh.');
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

      {/* Modal Kartu Kendali Resmi Santri */}
      <KartuKendaliModal
        isOpen={showKartuKendaliModal}
        initialSiswa={kartuKendaliSiswa}
        onClose={() => setShowKartuKendaliModal(false)}
      />
    </div>
  );
};
