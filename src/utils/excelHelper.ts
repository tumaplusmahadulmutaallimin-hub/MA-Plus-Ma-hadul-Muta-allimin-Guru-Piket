import * as XLSX from 'xlsx';

export interface ExcelExportOptions {
  filename: string;
  sheetName?: string;
  headers: string[];
  data: (string | number | boolean | null | undefined)[][];
  colWidths?: number[];
}

/**
 * Export data directly to a genuine Microsoft Excel (.xlsx) workbook.
 * Every header and data field is assigned its own discrete column cell range (A, B, C, D...),
 * strictly preventing data from ever merging or lumping into a single cell/column.
 */
export function exportToXLSX({
  filename,
  sheetName = 'Sheet1',
  headers,
  data,
  colWidths
}: ExcelExportOptions): void {
  // 1. Create a fresh workbook
  const wb = XLSX.utils.book_new();

  // 2. Prepare tabular Array of Arrays (AOA) with headers on row 0
  const sheetData: any[][] = [headers, ...data];

  // 3. Convert directly to worksheet cells (A1, B1, C1...)
  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  // 4. Ensure each cell has explicit coordinate format & type
  // Force text format 's' for NIP, NIS, NISN, Phone, and code strings so Excel never formats them as scientific notation
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:A1');
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = ws[cellRef];
      if (!cell) continue;

      // If header row, ensure string
      if (R === 0) {
        cell.t = 's';
        continue;
      }

      // If data value is a phone number, NIP, NIS, or string, enforce text cell
      if (typeof cell.v === 'string') {
        cell.t = 's';
      } else if (typeof cell.v === 'number') {
        // If number is an integer longer than 9 digits (like NIP/NISN), treat as text
        if (cell.v > 999999999) {
          cell.t = 's';
          cell.v = String(cell.v);
        } else {
          cell.t = 'n';
        }
      } else if (typeof cell.v === 'boolean') {
        cell.t = 'b';
      }
    }
  }

  // 5. Calculate individual column width (wch) for neat separate column spacing
  ws['!cols'] = headers.map((header, colIdx) => {
    if (colWidths && colWidths[colIdx]) {
      return { wch: colWidths[colIdx] };
    }
    const maxContentLen = data.reduce((max, row) => {
      const cellVal = row[colIdx];
      const len = cellVal !== null && cellVal !== undefined ? String(cellVal).length : 0;
      return Math.max(max, len);
    }, header.length);

    // Give clear margin between cell columns
    return { wch: Math.min(Math.max(maxContentLen + 4, 12), 48) };
  });

  // 6. Append sheet to workbook
  const validSheetName = (sheetName || 'Data').substring(0, 31).replace(/[\\/?*\[\]]/g, '');
  XLSX.utils.book_append_sheet(wb, ws, validSheetName);

  // 7. Generate binary XLSX output and trigger download as genuine application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
  const cleanFilename = filename.toLowerCase().endsWith('.xlsx')
    ? filename
    : `${filename}.xlsx`;

  try {
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = cleanFilename;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }, 100);
  } catch {
    // Fallback to SheetJS writeFile
    XLSX.writeFile(wb, cleanFilename, { bookType: 'xlsx', type: 'binary' });
  }
}

/**
 * Splits a text line by common spreadsheet delimiters (;, \t, |)
 * while preserving quoted values, if columns were lumped into a single cell.
 */
function parseDelimitedLine(text: string): string[] {
  // If line contains semicolon or tab, prioritize them
  const delimiter = text.includes('\t')
    ? '\t'
    : text.includes(';')
    ? ';'
    : text.includes('|')
    ? '|'
    : ',';

  const result: string[] = [];
  let cur = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      result.push(cur.trim().replace(/^["']|["']$/g, ''));
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur.trim().replace(/^["']|["']$/g, ''));
  return result;
}

/**
 * Reads a native Excel (.xlsx or .xls) file uploaded by the user.
 * Guarantees each row is separated into an array of distinct column cells (A, B, C...).
 * If an uploaded file has columns lumped into one text cell (e.g. from pasted CSV or unparsed raw cells),
 * this automatically splits them into individual cell column ranges.
 */
export function readXLSXFile(file: File): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        if (!buffer) {
          throw new Error('Gagal membaca isi file spreadsheet.');
        }

        const wb = XLSX.read(buffer, {
          type: 'array',
          cellDates: true,
          raw: false
        });

        const firstSheetName = wb.SheetNames[0];
        if (!firstSheetName) {
          throw new Error('File Excel tidak memiliki lembar kerja (worksheet).');
        }

        const ws = wb.Sheets[firstSheetName];
        // Convert to array of arrays (header: 1)
        const rawRows = XLSX.utils.sheet_to_json(ws, {
          header: 1,
          defval: '',
          raw: false
        }) as any[][];

        // Process rows and guarantee clean column cell ranges
        const cleanedRows: string[][] = [];

        for (const row of rawRows) {
          if (!Array.isArray(row)) continue;

          // Check if row is completely empty
          const hasContent = row.some(cell => String(cell || '').trim() !== '');
          if (!hasContent) continue;

          // If the row has only 1 element but contains delimiters (lumped together in 1 cell)
          if (row.length === 1 && typeof row[0] === 'string') {
            const firstCellText = row[0].trim();
            if (
              firstCellText.includes(';') ||
              firstCellText.includes('\t') ||
              firstCellText.includes('|') ||
              (firstCellText.includes(',') && !firstCellText.startsWith('http'))
            ) {
              const splitColumns = parseDelimitedLine(firstCellText);
              if (splitColumns.length > 1) {
                cleanedRows.push(splitColumns);
                continue;
              }
            }
          }

          // Normal multi-column cells: map each cell to trimmed string
          const formattedRow = row.map(cell => {
            if (cell === null || cell === undefined) return '';
            return String(cell).trim();
          });

          cleanedRows.push(formattedRow);
        }

        resolve(cleanedRows);
      } catch (err: any) {
        reject(err);
      }
    };

    reader.onerror = () => {
      reject(new Error('Terjadi kesalahan saat membaca file spreadsheet.'));
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * Downloads a ready-to-fill standard .xlsx template for Guru
 */
export function downloadGuruTemplateXLSX(): void {
  const headers = [
    'No',
    'Nama Lengkap',
    'Gelar',
    'NIP / NUPTK',
    'Mata Pelajaran',
    'Jenis PTK',
    'Status Kepegawaian',
    'No WhatsApp'
  ];

  const sampleRows = [
    ['1', 'Ahmad Setiawan', 'S.Pd', '198507122010011005', 'Fisika, IPA Terpadu', 'Guru Mapel', 'DPK/Kemenag', '081234567890'],
    ['2', 'Siti Nurhaliza', 'M.Pd', '198904252015022003', 'Bahasa Arab, Fikih', 'Guru Mapel', 'Tetap Yayasan', '082198765432'],
    ['3', 'Muhammad Zainal Arifin', 'S.Pd', '199203152019031008', 'Matematika Peminatan', 'Guru Mapel', 'Tidak Tetap', '085712345678']
  ];

  exportToXLSX({
    filename: 'Template_Import_Data_Guru_MAPLUS.xlsx',
    sheetName: 'Template Guru',
    headers,
    data: sampleRows,
    colWidths: [8, 28, 12, 24, 28, 16, 20, 18]
  });
}

/**
 * Downloads a ready-to-fill standard .xlsx template for Siswa / Santri
 */
export function downloadSiswaTemplateXLSX(): void {
  const headers = [
    'No',
    'NIS / Nomor Induk',
    'NISN',
    'Nama Lengkap Siswa',
    'Jenis Kelamin (L/P)',
    'Kelas',
    'Program Belajar',
    'Penerima MBG (Ya/Tidak)',
    'Nama Orang Tua / Wali',
    'No WhatsApp Wali'
  ];

  const sampleRows = [
    ['1', '20241001', '0087654321', 'Muhammad Fatih Robbani', 'L', 'XA', 'Tahfidz & Riset', 'Ya', 'Bpk. Hendra Gunawan', '081234567890'],
    ['2', '20241002', '0087654322', 'Aisyah Putri Azzahra', 'P', 'XA', 'Tahfidz Al-Qur\'an', 'Ya', 'Bpk. Ahmad Fauzi', '082134567891'],
    ['3', '20241003', '0087654323', 'Rayhan Firdaus', 'L', 'XB', 'Olimpiade Sains', 'Tidak', 'Ibu Nurhayati', '085712345679']
  ];

  exportToXLSX({
    filename: 'Template_Import_Data_Siswa_MAPLUS.xlsx',
    sheetName: 'Template Siswa',
    headers,
    data: sampleRows,
    colWidths: [8, 20, 16, 30, 20, 12, 22, 22, 26, 18]
  });
}

/**
 * Downloads a ready-to-fill standard .xlsx template for Jadwal Guru Piket
 */
export function downloadJadwalPiketTemplateXLSX(): void {
  const headers = [
    'No',
    'Hari (Senin-Sabtu)',
    'Koordinator Piket',
    'Anggota Tim (Pisahkan koma)',
    'Jam Mulai (HH:MM)',
    'Jam Selesai (HH:MM)',
    'Fokus Tugas Harian'
  ];

  const sampleRows = [
    ['1', 'Senin', 'Zainal Arifin, S.Pd', 'Ahmad Setiawan, S.Pd, Siti Fatimah, S.Pd', '06:45', '14:30', 'Penyambutan santri, Presensi KBM, Izin Keluar & MBG'],
    ['2', 'Selasa', 'Ahmad Setiawan, S.Pd', 'Muhammad Ridwan, M.Pd, Nurul Hidayah, S.Pd', '06:45', '14:30', 'Ketertiban apel pagi, Monitoring KBM jam 1-8'],
    ['3', 'Rabu', 'Siti Fatimah, S.Pd', 'Drs. H. M. Fauzan, M.Pd.I, Hendra Gunawan, S.Kom', '06:45', '14:30', 'Pemeriksaan atribut santri, Izin keluar kelas'],
    ['4', 'Kamis', 'Muhammad Ridwan, M.Pd', 'Zainal Arifin, S.Pd, Aisyah Rahmawati, S.Pd', '06:45', '14:30', 'Penyambutan santri, Dispensasi tugas khusus'],
    ['5', 'Jumat', 'Zainal Arifin, S.Pd', 'Ahmad Setiawan, S.Pd, Siti Fatimah, S.Pd', '06:45', '11:45', 'Penyambutan santri, Sholat Jum\'at berjamaah'],
    ['6', 'Sabtu', 'Nurul Hidayah, S.Pd', 'Hendra Gunawan, S.Kom, Muhammad Ridwan, M.Pd', '06:45', '13:00', 'Kegiatan ekstrakurikuler & penertiban lingkungan']
  ];

  exportToXLSX({
    filename: 'Template_Import_Jadwal_Piket_MAPLUS.xlsx',
    sheetName: 'Template Piket',
    headers,
    data: sampleRows,
    colWidths: [6, 18, 28, 45, 18, 18, 45]
  });
}

/**
 * Downloads a ready-to-fill standard .csv template for Jadwal Guru Piket
 */
export function downloadJadwalPiketTemplateCSV(): void {
  const csvContent =
    'No,Hari,Koordinator Piket,Anggota Tim (Pisahkan koma),Jam Mulai,Jam Selesai,Fokus Tugas Harian\n' +
    '1,Senin,"Zainal Arifin, S.Pd","Ahmad Setiawan, S.Pd; Siti Fatimah, S.Pd",06:45,14:30,"Penyambutan santri, Presensi KBM, Izin Keluar & MBG"\n' +
    '2,Selasa,"Ahmad Setiawan, S.Pd","Muhammad Ridwan, M.Pd; Nurul Hidayah, S.Pd",06:45,14:30,"Ketertiban apel pagi, Monitoring KBM jam 1-8"\n' +
    '3,Rabu,"Siti Fatimah, S.Pd","Hendra Gunawan, S.Kom; Aisyah Rahmawati, S.Pd",06:45,14:30,"Pemeriksaan atribut santri, Izin keluar kelas"\n' +
    '4,Kamis,"Muhammad Ridwan, M.Pd","Zainal Arifin, S.Pd; Aisyah Rahmawati, S.Pd",06:45,14:30,"Penyambutan santri, Dispensasi tugas khusus"\n' +
    '5,Jumat,"Zainal Arifin, S.Pd","Ahmad Setiawan, S.Pd; Siti Fatimah, S.Pd",06:45,11:45,"Penyambutan santri, Sholat Jum\'at berjamaah"\n' +
    '6,Sabtu,"Nurul Hidayah, S.Pd","Hendra Gunawan, S.Kom; Muhammad Ridwan, M.Pd",06:45,13:00,"Kegiatan ekstrakurikuler & penertiban lingkungan"';

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'Template_Import_Jadwal_Piket_MAPLUS.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


