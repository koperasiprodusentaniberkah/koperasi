import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  KeyRound,
  Lock,
  User,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { Anggota } from '../../types/koperasi';

interface AccountHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
  anggotaList: Anggota[];
  onSelectAccount: (userId: string, kataSandi: string) => void;
}

export const AccountHelperModal: React.FC<AccountHelperModalProps> = ({
  isOpen,
  onClose,
  anggotaList,
  onSelectAccount
}) => {
  const [search, setSearch] = useState('');
  const [showSecret, setShowSecret] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return anggotaList;
    return anggotaList.filter(
      a =>
        a.nama.toLowerCase().includes(q) ||
        a.userId.toLowerCase().includes(q) ||
        a.nomorAnggota.toLowerCase().includes(q) ||
        a.nik.includes(q)
    );
  }, [anggotaList, search]);

  if (!isOpen) return null;

  return (
    <div
      id="modal-account-helper"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Daftar 93 Akun Anggota Koperasi
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold">
                  {anggotaList.length} Akun
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Pilih salah satu akun untuk auto-fill User ID & Kata Sandi Khusus secara instan.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Search */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama anggota, User ID (petani01), atau nomor..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              type="button"
              onClick={() => setShowSecret(!showSecret)}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700"
            >
              {showSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showSecret ? 'Sembunyikan Sandi & PIN' : 'Tampilkan Sandi & PIN'}</span>
            </button>
            <span className="text-[11px] text-slate-400 font-mono">
              Hasil: {filtered.length}
            </span>
          </div>
        </div>

        {/* Account Table */}
        <div className="overflow-y-auto flex-1 p-4">
          <div className="space-y-2">
            {filtered.slice(0, 50).map((a, idx) => (
              <div
                key={a.id}
                className="p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-700 text-blue-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {a.nomorAnggota.replace('KOP-MTB ', '')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{a.nama}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono">
                        {a.nomorAnggota}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                      <span>
                        User ID: <strong className="text-emerald-400 font-mono">{a.userId}</strong>
                      </span>
                      <span>
                        Sandi:{' '}
                        <strong className="text-amber-300 font-mono">
                          {showSecret ? a.kataSandi : '••••••••'}
                        </strong>
                      </span>
                      <span>
                        PIN Khusus:{' '}
                        <strong className="text-sky-300 font-mono">
                          {showSecret ? a.pinKhusus : '••••••'}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSelectAccount(a.userId, a.kataSandi);
                    onClose();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <span>Gunakan Akun Ini</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {filtered.length > 50 && (
            <p className="text-center text-xs text-slate-500 py-3">
              Menampilkan 50 dari {filtered.length} akun. Gunakan kolom pencarian di atas untuk mencari nama lainnya.
            </p>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-10 text-slate-500 text-xs">
              Tidak ditemukan akun anggota dengan kata kunci tersebut.
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-blue-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Format User ID: <code className="text-slate-300">petani01</code> s/d <code className="text-slate-300">petani93</code></span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
