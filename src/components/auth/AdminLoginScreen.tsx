import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Sprout,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  KeyRound,
  Users,
  Search
} from 'lucide-react';
import { useKoperasi } from '../../context/KoperasiContext';
import { AccountHelperModal } from './AccountHelperModal';

export const AdminLoginScreen: React.FC = () => {
  const { loginAdmin, loginAnggota, anggotaList } = useKoperasi();

  // Tab State: 'anggota' (Default) or 'admin'
  const [activeTab, setActiveTab] = useState<'anggota' | 'admin'>('anggota');

  // Anggota Form State
  const [memberUserId, setMemberUserId] = useState('petani01');
  const [memberPassword, setMemberPassword] = useState('Tani#01');
  const [showMemberPassword, setShowMemberPassword] = useState(false);

  // Admin Form State
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHelperModal, setShowHelperModal] = useState(false);

  // Handle Login Anggota (93 Akun)
  const handleMemberLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = loginAnggota(memberUserId, memberPassword);
      setIsLoading(false);
      if (!res.success) {
        setErrorMsg(res.message);
      }
    }, 250);
  };

  // Handle Login Admin
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const success = loginAdmin(adminUsername, adminPassword);
      setIsLoading(false);
      if (!success) {
        setErrorMsg('Username atau kata sandi tidak valid. Gunakan "admin" atau "admin123".');
      }
    }, 250);
  };

  const handleQuickMemberSelect = (userId: string, kataSandi: string) => {
    setMemberUserId(userId);
    setMemberPassword(kataSandi);
    setErrorMsg('');
  };

  const handleQuickAdminLogin = () => {
    setErrorMsg('');
    setIsLoading(true);
    setTimeout(() => {
      loginAdmin('admin', 'admin');
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-slate-900/95 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-5">
          {/* Logo & Header */}
          <div className="text-center space-y-2.5">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 text-white shadow-lg shadow-blue-500/20">
              <Sprout className="w-8 h-8" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-1">
                Portal Otentikasi Terpadu
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                MITRA TANI BERKAH
              </h1>
              <p className="text-xs text-slate-400">
                Koperasi Produsen Terpadu • Sistem Informasi & Privasi Anggota
              </p>
            </div>
          </div>

          {/* Mode Tabs: Anggota vs Admin */}
          <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs">
            <button
              id="tab-login-anggota"
              type="button"
              onClick={() => {
                setActiveTab('anggota');
                setErrorMsg('');
              }}
              className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'anggota'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>93 Anggota Tani</span>
            </button>

            <button
              id="tab-login-admin"
              type="button"
              onClick={() => {
                setActiveTab('admin');
                setErrorMsg('');
              }}
              className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Pengurus / Admin</span>
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: FORM LOGIN ANGGOTA */}
          {activeTab === 'anggota' && (
            <form onSubmit={handleMemberLogin} className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-300 font-semibold">
                    User ID Anggota (93 Akun)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowHelperModal(true)}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-medium underline flex items-center gap-1"
                  >
                    <Search className="w-3 h-3" />
                    <span>Lihat Daftar 93 Akun</span>
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="input-member-userid"
                    type="text"
                    required
                    value={memberUserId}
                    onChange={e => setMemberUserId(e.target.value)}
                    placeholder="Contoh: petani01, petani02, petani93..."
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Masukkan User ID unik Anda (e.g. <code>petani01</code> s/d <code>petani93</code>)
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-300 font-semibold">
                    Kata Sandi Khusus
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Format: <code>Tani#01</code>, <code>Tani#02</code>...
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="input-member-password"
                    type={showMemberPassword ? 'text' : 'password'}
                    required
                    value={memberPassword}
                    onChange={e => setMemberPassword(e.target.value)}
                    placeholder="Masukkan kata sandi khusus Anda..."
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowMemberPassword(!showMemberPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                    aria-label={showMemberPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                  >
                    {showMemberPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="btn-submit-login-member"
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Memverifikasi Akun...</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Masuk Sebagai Anggota Koperasi</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Quick Pick Presets for 3 Members */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Pilih Cepat Akun Uji Coba:</span>
                  <button
                    type="button"
                    onClick={() => setShowHelperModal(true)}
                    className="text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>Semua 93</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickMemberSelect('petani01', 'Tani#01')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-semibold border transition-all text-center ${
                      memberUserId === 'petani01'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="truncate font-bold">Sutrisno</div>
                    <div className="text-[9px] text-slate-400 font-mono">petani01</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickMemberSelect('petani02', 'Tani#02')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-semibold border transition-all text-center ${
                      memberUserId === 'petani02'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="truncate font-bold">Dadang H.</div>
                    <div className="text-[9px] text-slate-400 font-mono">petani02</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickMemberSelect('petani03', 'Tani#03')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-semibold border transition-all text-center ${
                      memberUserId === 'petani03'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="truncate font-bold">Ujang S.</div>
                    <div className="text-[9px] text-slate-400 font-mono">petani03</div>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: FORM LOGIN PENGURUS / ADMIN */}
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Username Admin Pengurus
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="input-login-username"
                    type="text"
                    required
                    value={adminUsername}
                    onChange={e => setAdminUsername(e.target.value)}
                    placeholder="Masukkan username admin..."
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-300 font-semibold">
                    Kata Sandi
                  </label>
                  <span className="text-[11px] text-blue-400">
                    Default: <strong>admin</strong>
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="input-login-password"
                    type={showAdminPassword ? 'text' : 'password'}
                    required
                    value={adminPassword}
                    onChange={e => setAdminPassword(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                    aria-label={showAdminPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="btn-submit-login"
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Memverifikasi Akses...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Masuk Sebagai Admin Koperasi</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* 1-Click Quick Login Admin */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  id="btn-quick-login-admin"
                  type="button"
                  onClick={handleQuickAdminLogin}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer hover:border-slate-600"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>1-Klik Masuk Cepat Admin (Demo Langsung)</span>
                </button>
              </div>
            </form>
          )}

          {/* Legalitas Mini Badge */}
          <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-800/80 text-[10px] text-slate-400 space-y-1">
            <div className="flex items-center justify-between">
              <span>Legalitas Koperasi:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Terdaftar Resmi
              </span>
            </div>
            <div className="text-slate-500 font-mono">
              SK: AHU-0004819.AH.01.26 • NIB: 1904230058291
            </div>
          </div>
        </div>
      </div>

      {/* Account Helper Search Modal */}
      <AccountHelperModal
        isOpen={showHelperModal}
        onClose={() => setShowHelperModal(false)}
        anggotaList={anggotaList}
        onSelectAccount={(uid, pwd) => {
          setMemberUserId(uid);
          setMemberPassword(pwd);
          setErrorMsg('');
        }}
      />
    </div>
  );
};
