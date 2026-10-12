import React, { useRef, useState } from 'react';
import {
  Upload,
  Camera,
  RefreshCw,
  Trash2,
  Sparkles,
  Check,
  Building2,
  User,
  X
} from 'lucide-react';

import { optimizeImageFile } from '../../utils/logoStorage';

export interface ImagePreset {
  label: string;
  url: string;
  category?: string;
}

interface ImageUploaderProps {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  label?: string;
  sublabel?: string;
  shape?: 'square' | 'circle' | 'rectangle';
  presets?: ImagePreset[];
  showPresets?: boolean;
  className?: string;
}

const DEFAULT_PRESETS: ImagePreset[] = [
  {
    label: 'Guru Pria Formal (Peci)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    category: 'guru'
  },
  {
    label: 'Guru Wanita Formal (Hijab)',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
    category: 'guru'
  },
  {
    label: 'Guru Senior Pria',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    category: 'guru'
  },
  {
    label: 'Santri Putra (Koko/Peci)',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200',
    category: 'siswa'
  },
  {
    label: 'Santri Putri (Jilbab Putih)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    category: 'siswa'
  }
];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImage,
  onImageChange,
  label = 'Foto / Gambar',
  sublabel = 'Format PNG, JPG, JPEG (Maksimal 5MB)',
  shape = 'square',
  presets = DEFAULT_PRESETS,
  showPresets = true,
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Format tidak didukung. Harap pilih file gambar (JPG, PNG, atau WEBP).');
      setTimeout(() => setUploadError(null), 4000);
      return;
    }
    setUploadError(null);
    setIsProcessing(true);

    try {
      const optimizedDataUrl = await optimizeImageFile(file, 512);
      onImageChange(optimizedDataUrl);
    } catch (err: any) {
      console.warn('Canvas optimization warning, using standard reader:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageChange(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsProcessing(false);
      // Reset file input value so selecting the same file again works
      e.target.value = '';
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange('');
  };

  const containerShapeClass =
    shape === 'circle'
      ? 'w-24 h-24 rounded-full'
      : shape === 'rectangle'
      ? 'w-full h-36 rounded-2xl'
      : 'w-28 h-28 rounded-2xl';

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-700">{label}</label>
          {showPresets && (
            <button
              type="button"
              onClick={() => setShowPresetModal(true)}
              className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Pilih dari Galeri</span>
            </button>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {/* Image Preview & Upload Container */}
      <div className="flex items-center gap-4">
        <div
          onClick={triggerUpload}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`relative ${containerShapeClass} overflow-hidden border-2 border-dashed border-slate-300 hover:border-emerald-600 bg-slate-50 flex items-center justify-center cursor-pointer transition-all group shrink-0 shadow-xs`}
        >
          {isProcessing && (
            <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-2xs flex flex-col items-center justify-center text-white z-20">
              <RefreshCw className="w-5 h-5 mb-1 animate-spin text-amber-300" />
              <span className="text-[9.5px] font-bold">Mengoptimalkan...</span>
            </div>
          )}
          {currentImage ? (
            <>
              <img
                src={currentImage}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div
                className={`absolute inset-0 bg-black/50 backdrop-blur-2xs flex flex-col items-center justify-center text-white transition-opacity ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <RefreshCw className="w-5 h-5 mb-1 animate-spin-slow" />
                <span className="text-[10px] font-bold">Ganti Foto</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-2 text-slate-400 group-hover:text-emerald-600 transition-colors text-center">
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-bold">Upload</span>
            </div>
          )}
        </div>

        {/* Buttons / Instructions */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={triggerUpload}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{currentImage ? 'Ubah Gambar' : 'Pilih Gambar'}</span>
            </button>

            {currentImage && (
              <button
                type="button"
                onClick={handleRemove}
                className="px-2.5 py-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title="Hapus foto ini"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            )}
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">{sublabel}</p>
        </div>
      </div>

      {uploadError && (
        <p className="text-[11px] text-red-600 font-medium bg-red-50 p-2 rounded-xl border border-red-200 mt-2">
          ⚠️ {uploadError}
        </p>
      )}

      {/* Preset Modal */}
      {showPresetModal && (
        <div className="fixed inset-0 z-[10000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Galeri Preset Gambar Madrasah</h3>
                <p className="text-[11px] text-slate-500">
                  Pilih gambar sampel berkualitas tinggi atau upload dari perangkat Anda.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPresetModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-80 overflow-y-auto p-1">
              {presets.map((preset, idx) => {
                const isSelected = currentImage === preset.url;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onImageChange(preset.url);
                      setShowPresetModal(false);
                    }}
                    className={`relative rounded-2xl overflow-hidden border-2 p-1 text-left flex flex-col items-center gap-1.5 transition-all group cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-emerald-400 bg-white'
                    }`}
                  >
                    <div className="w-full h-20 rounded-xl overflow-hidden bg-slate-100 relative">
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-800 text-center line-clamp-1">
                      {preset.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowPresetModal(false);
                  triggerUpload();
                }}
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload File Lokal Sendiri
              </button>
              <button
                type="button"
                onClick={() => setShowPresetModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
