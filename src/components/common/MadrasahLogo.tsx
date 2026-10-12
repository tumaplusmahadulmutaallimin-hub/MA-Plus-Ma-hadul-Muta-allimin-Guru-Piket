import React, { useState } from 'react';
import { Building2, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MadrasahLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';
  withBorder?: boolean;
  variant?: 'shield' | 'circle' | 'rounded';
  src?: string; // Optional direct override, defaults to active madrasahInfo.logo
  alt?: string;
}

/**
 * MadrasahLogo:
 * Wadah logo madrasah responsif dan fleksibel.
 * - Jika logo sudah diunggah oleh admin melalui Pengaturan Sistem, gambar logo akan ditampilkan di wadah ini.
 * - Jika belum diunggah, wadah tetap terstruktur rapi dengan placeholder emblem/gedung madrasah elegan tanpa gambar bawaan statis.
 * - Terintegrasi otomatis ke seluruh aplikasi, header, sidebar, dashboard, kartu kendali, dan berkas cetak dokumen resmi.
 */
export const MadrasahLogo: React.FC<MadrasahLogoProps> = ({
  className = '',
  size = 'md',
  withBorder = false,
  variant = 'rounded',
  src,
  alt = 'Logo Madrasah'
}) => {
  const [imgError, setImgError] = useState(false);

  // Read single source of truth from global AppContext if available
  let contextLogo: string | undefined;
  try {
    const context = useApp();
    contextLogo = context?.madrasahInfo?.logo;
  } catch {
    // Rendered outside AppProvider fallback
  }

  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-24 h-24',
    custom: ''
  }[size];

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
    '2xl': 'w-12 h-12',
    custom: 'w-6 h-6'
  }[size];

  const roundedClasses = {
    shield: 'rounded-2xl',
    circle: 'rounded-full',
    rounded: 'rounded-xl'
  }[variant];

  // Resolve active logo source (only valid if explicitly set or uploaded)
  const candidateSrc = (src !== undefined ? src : contextLogo) || '';
  const hasValidLogo = candidateSrc.trim().length > 0;

  // Reset imgError if source changes
  const [prevSrc, setPrevSrc] = useState(candidateSrc);
  if (prevSrc !== candidateSrc) {
    setPrevSrc(candidateSrc);
    setImgError(false);
  }

  // 1. If valid logo is uploaded/set and has no load error, render the uploaded logo in container
  if (hasValidLogo && !imgError) {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden bg-white ${sizeClasses} ${roundedClasses} ${
          withBorder ? 'border border-emerald-500/30 shadow-xs' : ''
        } ${className}`}
      >
        <img
          key={candidateSrc}
          src={candidateSrc}
          alt={alt}
          className="w-full h-full object-contain filter drop-shadow-2xs"
          onError={() => setImgError(true)}
          loading="eager"
        />
      </div>
    );
  }

  // 2. Default clean placeholder container ("Wadah Logo" siap upload)
  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center shrink-0 overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50/60 to-slate-100 text-emerald-800 border-2 border-dashed border-emerald-400/60 shadow-2xs group ${sizeClasses} ${roundedClasses} ${className}`}
      title="Wadah Logo Madrasah (Dapat diunggah melalui menu Pengaturan Sistem)"
    >
      <Building2 className={`${iconSizes} text-emerald-700/80 group-hover:scale-110 transition-transform`} />
      {size === '2xl' && (
        <span className="text-[9px] font-bold text-emerald-800/80 mt-1 uppercase tracking-wider text-center px-1">
          Wadah Logo
        </span>
      )}
    </div>
  );
};
