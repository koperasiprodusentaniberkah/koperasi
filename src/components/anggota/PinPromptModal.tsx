import React, { useState } from 'react';
import {
  X,
  Lock,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { Anggota } from '../../types/koperasi';

interface PinPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetMember: Anggota;
  onSuccess: () => void;
  onVerify: (pin: string) => { success: boolean; message: string };
}

export const PinPromptModal: React.FC<PinPromptModalProps> = ({
  isOpen,
  onClose,
  targetMember,
  onSuccess,
  onVerify
}) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (pin.length < 4) {
      setErrorMsg('PIN Khusus harus terdiri dari 6 digit angka.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      const res = onVerify(pin);
      setIsVerifying(false);

      if (res.success) {
        setPin('');
        onSuccess();
      } else {
        setErrorMsg(res.message || 'PIN Khusus yang dimasukkan salah.');
      }
    }, 250);
  };

  const handleKeyClick = (digit: string) => {
    if (pin.length < 6) {
      setPin(prev => prev + digit);
      setErrorMsg('');
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleClear = () => {
    setPin('');
    setErrorMsg('');
  };

  return (
    <div
      id="modal-pin-prompt"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 text-blue-300 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                Proteksi Privasi Pinjaman
              </span>
              <h3 className="text-base font-bold text-white">
                Masukkan PIN Khusus Anda
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Member Card */}
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-blue-600 font-semibold">Akun Terautentikasi:</div>
              <div className="text-sm font-bold text-slate-900">{targetMember.nama}</div>
              <div className="text-xs text-slate-500 font-mono">
                {targetMember.nomorAnggota} • User ID: {targetMember.userId}
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              {targetMember.nama.slice(0, 2).toUpperCase()}
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed text-center">
            Untuk menjaga kerahasiaan keuangan dan privasi antar-anggota, masukkan <strong>6-digit PIN Khusus</strong> Anda untuk membuka rincian pinjaman pribadi.
          </p>

          {/* Error message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* PIN Input & Visual Dots */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center items-center gap-2.5 my-2">
              {[0, 1, 2, 3, 4, 5].map(idx => {
                const filled = idx < pin.length;
                return (
                  <div
                    key={idx}
                    className={`w-11 h-12 rounded-xl border-2 flex items-center justify-center font-mono text-xl font-bold transition-all ${
                      filled
                        ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-300'
                    }`}
                  >
                    {filled ? (showPin ? pin[idx] : '•') : ''}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between px-1">
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1.5"
              >
                {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPin ? 'Sembunyikan Digit' : 'Lihat Digit PIN'}</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-slate-400 hover:text-rose-600"
              >
                Hapus Semua
              </button>
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => handleKeyClick(d)}
                  className="py-3 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100 text-slate-800 font-bold text-base transition-colors"
                >
                  {d}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClear}
                className="py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 font-semibold text-xs transition-colors"
              >
                C
              </button>
              <button
                type="button"
                onClick={() => handleKeyClick('0')}
                className="py-3 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100 text-slate-800 font-bold text-base transition-colors"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="py-3 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-semibold text-xs transition-colors"
              >
                ⌫
              </button>
            </div>

            {/* Hint for Demo / Testing */}
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Petunjuk Demo: PIN Khusus Anda adalah <strong>{targetMember.pinKhusus}</strong></span>
              </span>
              <button
                type="button"
                onClick={() => setPin(targetMember.pinKhusus)}
                className="text-[10px] font-bold underline text-amber-900 ml-2 shrink-0 cursor-pointer"
              >
                Isi Otomatis
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                id="btn-submit-verify-pin"
                type="submit"
                disabled={pin.length < 4 || isVerifying}
                className="w-2/3 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isVerifying ? (
                  <span>Memverifikasi PIN...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verifikasi & Buka Pinjaman</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
