import React from 'react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  Trash2,
  Sparkles
} from 'lucide-react';
import { useKoperasi } from '../../context/KoperasiContext';
import { ToastItem } from '../../types/koperasi';

export const ToastContainer: React.FC = () => {
  const { toastList, dismissToast } = useKoperasi();

  if (!toastList || toastList.length === 0) return null;

  return (
    <aside
      aria-label="Notifikasi Sistem"
      className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-md w-[calc(100vw-2.5rem)] pointer-events-none"
    >
      {toastList.map((toast: ToastItem) => {
        const isSuccess = toast.type === 'success';
        const isDelete = toast.type === 'delete';
        const isWarning = toast.type === 'warning';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            role="alert"
            aria-live="assertive"
            className={`pointer-events-auto p-4 rounded-2xl border shadow-xl backdrop-blur-md transition-all duration-300 transform translate-y-0 animate-in slide-in-from-top-3 fade-in flex items-start gap-3.5 ${
              isSuccess
                ? 'bg-emerald-950/95 border-emerald-500/40 text-emerald-100 shadow-emerald-950/40'
                : isDelete
                ? 'bg-rose-950/95 border-rose-500/40 text-rose-100 shadow-rose-950/40'
                : isWarning
                ? 'bg-amber-950/95 border-amber-500/40 text-amber-100 shadow-amber-950/40'
                : 'bg-slate-900/95 border-blue-500/40 text-slate-100 shadow-slate-950/40'
            }`}
          >
            {/* Icon */}
            <div
              className={`p-2 rounded-xl shrink-0 ${
                isSuccess
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : isDelete
                  ? 'bg-rose-500/20 text-rose-400'
                  : isWarning
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-blue-500/20 text-blue-400'
              }`}
            >
              {isSuccess && <CheckCircle2 className="w-5 h-5" />}
              {isDelete && <Trash2 className="w-5 h-5" />}
              {isWarning && <AlertTriangle className="w-5 h-5" />}
              {isInfo && <Sparkles className="w-5 h-5" />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-white tracking-wide truncate">
                  {toast.title}
                </h4>
                <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                  {toast.timestamp}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {toast.message}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              aria-label="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </aside>
  );
};
