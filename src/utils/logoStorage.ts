/**
 * Robust Logo & Image Storage Utility for Sistem Guru Piket MA PLUS
 * 
 * Features:
 * - Dual-layer persistence: localStorage + IndexedDB
 * - Image compression / resizing via HTML5 Canvas (keeps Base64 small ~30-60KB)
 * - Fallback to default official logo
 * - Cache busting & dynamic sync across all components
 */

export const DEFAULT_LOGO_URL = '';
export const FALLBACK_LOGO_URL = '';

const STORAGE_KEY_LOGO = 'maplus_official_logo';
const IDB_DB_NAME = 'maplus_system_db';
const IDB_STORE_NAME = 'settings_store';
const IDB_KEY_LOGO = 'active_madrasah_logo';

/**
 * Initialize IndexedDB instance
 */
function openLogoDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not supported'));
    }

    const request = indexedDB.open(IDB_DB_NAME, 1);

    request.onupgradeneeded = (event: any) => {
      const db: IDBDatabase = event.target.result;
      if (!db.objectStoreNames.contains(IDB_STORE_NAME)) {
        db.createObjectStore(IDB_STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Read stored custom logo synchronously from localStorage
 */
export function getStoredLogoSync(): string | null {
  try {
    if (typeof window === 'undefined') return null;
    const direct = localStorage.getItem(STORAGE_KEY_LOGO);
    if (direct && direct.trim() !== '') return direct;

    const info = localStorage.getItem('maplus_madrasah_info');
    if (info) {
      const parsed = JSON.parse(info);
      if (parsed.logo && typeof parsed.logo === 'string' && parsed.logo.trim() !== '') {
        return parsed.logo;
      }
    }
  } catch (err) {
    console.warn('Failed to read logo sync from localStorage:', err);
  }
  return null;
}

/**
 * Read stored custom logo asynchronously, checking IndexedDB as authoritative backup
 */
export async function getStoredLogoAsync(): Promise<string | null> {
  // First check sync localStorage
  const syncLogo = getStoredLogoSync();
  if (syncLogo) return syncLogo;

  // Then try IndexedDB
  try {
    const db = await openLogoDB();
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE_NAME, 'readonly');
      const store = tx.objectStore(IDB_STORE_NAME);
      const req = store.get(IDB_KEY_LOGO);

      req.onsuccess = () => {
        const val = req.result;
        if (val && typeof val === 'string' && val.trim() !== '') {
          // Sync back to localStorage for faster subsequent sync reads
          try {
            localStorage.setItem(STORAGE_KEY_LOGO, val);
          } catch {}
          resolve(val);
        } else {
          resolve(null);
        }
      };

      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Persist logo to both localStorage and IndexedDB
 */
export async function persistLogo(logoValue: string): Promise<boolean> {
  if (!logoValue || typeof logoValue !== 'string' || !logoValue.trim()) {
    throw new Error('Logo tidak valid');
  }

  const trimmed = logoValue.trim();

  // 1. Save to localStorage
  try {
    localStorage.setItem(STORAGE_KEY_LOGO, trimmed);

    // Also sync maplus_madrasah_info if it exists
    const infoStr = localStorage.getItem('maplus_madrasah_info');
    if (infoStr) {
      try {
        const parsed = JSON.parse(infoStr);
        parsed.logo = trimmed;
        localStorage.setItem('maplus_madrasah_info', JSON.stringify(parsed));
      } catch {}
    }
  } catch (err) {
    console.warn('Failed to save logo in localStorage (quota may be full):', err);
  }

  // 2. Save to IndexedDB (virtually unlimited quota for high-res images)
  try {
    const db = await openLogoDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
      const store = tx.objectStore(IDB_STORE_NAME);
      const req = store.put(trimmed, IDB_KEY_LOGO);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB write warning:', err);
  }

  return true;
}

/**
 * Reset logo to official default
 */
export async function resetLogoToDefault(): Promise<boolean> {
  try {
    localStorage.removeItem(STORAGE_KEY_LOGO);
  } catch {}

  try {
    const db = await openLogoDB();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
      const store = tx.objectStore(IDB_STORE_NAME);
      const req = store.delete(IDB_KEY_LOGO);
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
    });
  } catch {}

  return true;
}

/**
 * Compress and optimize image file to Base64 data URL
 * Ensures canvas keeps dimension reasonable (e.g. max 512x512) and output ~40-80KB
 */
export function optimizeImageFile(file: File, maxDimension = 512): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('File yang dipilih bukan gambar yang valid.'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
    reader.onload = (e) => {
      const result = e.target?.result;
      if (!result || typeof result !== 'string') {
        return reject(new Error('File kosong atau rusak.'));
      }

      const img = new Image();
      img.onerror = () => reject(new Error('Format file gambar tidak dapat dirender.'));
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Calculate scaling
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // If no canvas context, return raw reader result
          return resolve(result);
        }

        // Clean rendering
        ctx.clearRect(0, 0, width, height);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Keep transparent background if PNG, else JPEG
        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const quality = mimeType === 'image/jpeg' ? 0.88 : undefined;

        try {
          const optimizedDataUrl = canvas.toDataURL(mimeType, quality);
          resolve(optimizedDataUrl);
        } catch {
          resolve(result);
        }
      };

      img.src = result;
    };

    reader.readAsDataURL(file);
  });
}
