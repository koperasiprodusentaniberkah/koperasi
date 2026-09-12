import React from 'react';
import {
  X,
  ShieldAlert,
  Lock,
  UserX,
  ArrowRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { Anggota } from '../../types/koperasi';

interface AccessDeniedModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMember: Anggota | null;
  targetMember: Anggota;
  onOpenOwnLoan?: () => void;
}

export const AccessDeniedModal: React.FC<AccessDeniedModalProps> = ({
  isOpen,
  onClose,
  currentMember,
  targetMember,
  onOpenOwnLoan
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="modal-access-denied"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white border border-rose-200 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Warning Strip */}
        <div className="p-6 bg-gradient-to-r from-rose-600 via-rose-700 to-red-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 text-white flex items-center justify-center shrink-0">
              <ShieldAlert className="w-7 h-7 text-rose-100" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-200 bg-rose-900/50 px-2 py-0.5 rounded-full border border-rose-400/30">
                Privasi Terlindungi
              </span>
              <h3 className="text-lg font-black text-white mt-0.5">
                Akses Ditolak
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-rose-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/80 space-y-2.5">
            <div className="flex items-start gap-2 text-rose-800 font-bold text-xs">
              <Lock className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>Kebijakan Privasi Keuangan Antar-Anggota</span>
            </div>
            <p className="text-xs text-rose-900 leading-relaxed">
              Anda tidak dapat melihat data pinjaman milik <strong>{targetMember.nama}</strong> ({targetMember.nomorAnggota}).
            </p>
          </div>

          {/* Identity comparison */}
          <div className="space-y-2 text-xs border border-slate-100 rounded-2xl p-4 bg-slate-50/60">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
              <span className="text-slate-500">Akun Anda yang Sedang Aktif:</span>
              <span className="font-bold text-slate-800">
                {currentMember ? currentMember.nama : 'Anggota'}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-500">Akun yang Coba Diakses:</span>
              <span className="font-bold text-rose-600">
                {targetMember.nama}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 text-center leading-relaxed">
            Setiap anggota memiliki <strong>PIN Khusus Unik</strong> yang hanya dapat digunakan untuk membuka data pinjaman pribadi masing-masing.
          </p>

          {/* Action buttons */}
          <div className="space-y-2 pt-2">
            {onOpenOwnLoan && currentMember && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenOwnLoan();
                }}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                <span>Buka Data Pinjaman Saya ({currentMember.nama})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              id="btn-close-access-denied"
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
            >
              Saya Mengerti, Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
