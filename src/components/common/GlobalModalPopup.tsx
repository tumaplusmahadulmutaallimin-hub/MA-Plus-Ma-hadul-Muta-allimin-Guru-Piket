import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Info,
  X,
  HelpCircle
} from 'lucide-react';

export interface PopupConfig {
  type?: 'confirm' | 'delete' | 'success' | 'error' | 'info';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

interface GlobalModalPopupProps {
  config: PopupConfig | null;
  onClose: () => void;
}

export const GlobalModalPopup: React.FC<GlobalModalPopupProps> = ({ config, onClose }) => {
  if (!config) return null;

  const {
    type = 'info',
    title,
    message,
    confirmText = type === 'delete' ? 'Ya, Hapus Data' : type === 'confirm' ? 'OK, Lanjutkan' : 'OK, Mengerti',
    cancelText = 'Batal',
    onConfirm,
    onCancel,
    showCancel = type === 'confirm' || type === 'delete'
  } = config;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    onClose();
  };

  const renderIcon = () => {
    switch (type) {
      case 'delete':
        return (
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-sm border border-rose-200">
            <Trash2 className="w-6 h-6" />
          </div>
        );
      case 'success':
        return (
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-sm border border-emerald-200">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        );
      case 'error':
        return (
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 shadow-sm border border-red-200">
            <AlertTriangle className="w-6 h-6" />
          </div>
        );
      case 'confirm':
        return (
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-sm border border-amber-200">
            <HelpCircle className="w-6 h-6" />
          </div>
        );
      case 'info':
      default:
        return (
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 shadow-sm border border-blue-200">
            <Info className="w-6 h-6" />
          </div>
        );
    }
  };

  const getConfirmButtonClass = () => {
    switch (type) {
      case 'delete':
        return 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-md shadow-rose-600/30';
      case 'success':
        return 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-md shadow-emerald-600/30';
      case 'error':
        return 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-md shadow-red-600/30';
      case 'confirm':
        return 'bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white shadow-md shadow-emerald-800/30';
      case 'info':
      default:
        return 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-md shadow-blue-600/30';
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={handleCancel}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          {renderIcon()}

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {title}
              </h3>
              <button
                type="button"
                onClick={handleCancel}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors -mr-1"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          {showCancel && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              {cancelText}
            </button>
          )}
          <button
            type="button"
            onClick={handleConfirm}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${getConfirmButtonClass()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
