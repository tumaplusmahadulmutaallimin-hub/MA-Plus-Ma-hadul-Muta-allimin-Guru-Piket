/**
 * Date & Time Utilities for Sistem Guru Piket MA PLUS Ma'hadul Muta'allimin
 * 
 * Provides:
 * - Real-time live date and digital clock
 * - Indonesian localized day names and date formats
 * - Dynamic Hijri Islamic Calendar calculation
 * - React hook useLiveDateTime for reactive live updates
 */
import { useState, useEffect } from 'react';

export const INDONESIAN_DAY_NAMES = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu'
] as const;

export const INDONESIAN_MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
] as const;

export const INDONESIAN_MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Ags',
  'Sep',
  'Okt',
  'Nov',
  'Des'
] as const;

export const HIJRI_MONTH_NAMES = [
  'Muharram',
  'Safar',
  'Rabi\'ul Awwal',
  'Rabi\'ul Akhir',
  'Jumadil Ula',
  'Jumadil Akhir',
  'Rajab',
  'Sya\'ban',
  'Ramadhan',
  'Syawwal',
  'Dzulqa\'dah',
  'Dzulhijjah'
];

/**
 * Returns Indonesian Day Name (e.g. "Minggu", "Senin", "Jumat")
 */
export function getIndonesianDayName(date: Date = new Date(), variant: 'standard' | 'formal' = 'formal'): string {
  const dayIndex = date.getDay();
  const day = INDONESIAN_DAY_NAMES[dayIndex];
  if (variant === 'formal' && day === 'Jumat') {
    return "Jum'at";
  }
  return day;
}

/**
 * Formats a Date to Indonesian format
 * Example: "Minggu, 11 Okt 2026" or "11 Oktober 2026"
 */
export function formatIndonesianDate(
  date: Date = new Date(),
  options: {
    withDay?: boolean;
    shortMonth?: boolean;
    formalFriday?: boolean;
  } = { withDay: true, shortMonth: true, formalFriday: true }
): string {
  const day = date.getDate();
  const monthIdx = date.getMonth();
  const year = date.getFullYear();

  const monthStr = options.shortMonth
    ? INDONESIAN_MONTH_SHORT[monthIdx]
    : INDONESIAN_MONTH_NAMES[monthIdx];

  if (options.withDay) {
    const dayName = getIndonesianDayName(date, options.formalFriday ? 'formal' : 'standard');
    return `${dayName}, ${day} ${monthStr} ${year}`;
  }

  return `${day} ${monthStr} ${year}`;
}

/**
 * Returns digital clock string: "HH:mm:ss" or "HH:mm"
 */
export function formatDigitalClock(date: Date = new Date(), withSeconds: boolean = true): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  if (!withSeconds) return `${h}:${m}`;
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

/**
 * Kuwatie algorithm fallback for Hijri date calculation
 */
function kuwaitiHijri(date: Date, adjustmentDays: number = 0): { day: number; month: number; year: number } {
  const d = new Date(date.getTime() + adjustmentDays * 86400000);
  let day = d.getDate();
  let month = d.getMonth();
  let year = d.getFullYear();

  let m = month + 1;
  let y = year;
  if (m < 3) {
    y -= 1;
    m += 12;
  }

  let a = Math.floor(y / 100);
  let b = 2 - a + Math.floor(a / 4);
  if (y < 1583) b = 0;
  if (y === 1582) {
    if (m > 10) b = -10;
    if (m === 10) {
      b = 0;
      if (day > 4) b = -10;
    }
  }

  let jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524;
  b = 0;
  if (jd > 2299160) {
    a = Math.floor((jd - 1867216.25) / 36624.25);
    b = 1 + a - Math.floor(a / 4);
  }
  let bb = jd + b + 1524;
  let cc = Math.floor((bb - 122.1) / 365.25);
  let dd = Math.floor(365.25 * cc);
  let ee = Math.floor((bb - dd) / 30.6001);

  day = bb - dd - Math.floor(30.6001 * ee);
  month = ee - 1;
  if (ee > 13) {
    cc += 1;
    month = ee - 13;
  }
  year = cc - 4716;

  let wd = (jd + 1) % 7;
  let iyear = 10631.0 / 30.0;
  let epochastro = 1948084;
  let shift1 = 8.01 / 60.0;

  let z = jd - epochastro;
  let cyc = Math.floor(z / 10631.0);
  z = z - 10631 * cyc;
  let j = Math.floor((z - shift1) / iyear);
  let iy = 30 * cyc + j;
  z = z - Math.floor(j * iyear + shift1);
  let im = Math.floor((z + 28.5001) / 29.5);
  if (im === 13) im = 12;
  let id = z - Math.floor(29.5001 * im - 29);

  return { day: Math.max(1, id), month: Math.max(0, im - 1), year: iy };
}

/**
 * Returns dynamic Hijri date string (e.g. "30 Rabi'ul Akhir 1448 H")
 */
export function getHijriDateString(date: Date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const parts = formatter.format(date);
    if (parts && parts.length > 3) {
      const trimmed = parts.trim();
      return /H$/i.test(trimmed) ? trimmed : `${trimmed} H`;
    }
  } catch (err) {
    // Fall back to algorithm
  }

  const { day, month, year } = kuwaitiHijri(date);
  const monthName = HIJRI_MONTH_NAMES[month] || 'Bulan Hijriyah';
  return `${day} ${monthName} ${year} H`;
}

/**
 * Formats a Date to ISO Date string (YYYY-MM-DD)
 */
export function formatDateOnly(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Formats Date to Indonesian standard dd/mm/yyyy
 */
export function formatDateSlash(date: Date = new Date()): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

/**
 * Formats Date to "dd/mm/yyyy HH:mm"
 */
export function formatDateTimeSlash(date: Date = new Date()): string {
  return `${formatDateSlash(date)} ${formatDigitalClock(date, false)}`;
}

/**
 * React Hook for live digital clock & real-time date
 * Automatically updates every second, cleaned up on unmount.
 */
export function useLiveDateTime() {
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  useEffect(() => {
    // Sync immediately
    setCurrentDate(new Date());

    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    date: currentDate,
    time: formatDigitalClock(currentDate, true),
    timeShort: formatDigitalClock(currentDate, false),
    dayName: getIndonesianDayName(currentDate, 'formal'),
    dayNameStandard: getIndonesianDayName(currentDate, 'standard'),
    dateFormatted: formatIndonesianDate(currentDate, { withDay: true, shortMonth: true }),
    dateFormattedLong: formatIndonesianDate(currentDate, { withDay: true, shortMonth: false }),
    dateOnly: formatIndonesianDate(currentDate, { withDay: false, shortMonth: true }),
    hijriDate: getHijriDateString(currentDate),
    isoDate: formatDateOnly(currentDate),
    slashDate: formatDateSlash(currentDate)
  };
}
