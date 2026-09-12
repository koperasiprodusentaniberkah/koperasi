import React, { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  Store,
  CreditCard,
  PieChart,
  FileSpreadsheet,
  Settings,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  Tractor,
  Wheat,
  Banknote,
  PiggyBank,
  Sprout,
  X,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useKoperasi } from '../../context/KoperasiContext';

export type ActiveTabType =
  | 'dashboard'
  | 'profil'
  | 'anggota'
  | 'unit-usaha'
  | 'toko-saprodi'
  | 'sewa-alsintan'
  | 'agribisnis'
  | 'layanan-brilink'
  | 'pinjaman'
  | 'keuangan'
  | 'laporan-simpanan'
  | 'admin';

export interface SidebarProps {
  activeTab: ActiveTabType;
  setActiveTab?: (tab: ActiveTabType) => void;
  onSelectTab?: (tab: ActiveTabType) => void;
  isOpen?: boolean;
  isOpenMobile?: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onSelectTab,
  isOpen,
  isOpenMobile,
  onCloseMobile
}) => {
  const { notifications, loans, saprodiItems } = useKoperasi();

  const isActuallyOpen = isOpen ?? isOpenMobile ?? false;

  const pendingLoansCount = loans.filter(l => l.status === 'Menunggu Persetujuan').length;
  const unreadNotifCount = notifications.filter(n => !n.dibaca).length;
  const lowStockCount = saprodiItems.filter(s => s.stok <= s.stokMinimal).length;

  // Track if unit usaha sub-menu is expanded
  const [unitUsahaExpanded, setUnitUsahaExpanded] = useState(true);

  const handleSelect = (id: ActiveTabType) => {
    if (setActiveTab) {
      setActiveTab(id);
    }
    if (onSelectTab) {
      onSelectTab(id);
    }
    onCloseMobile();
  };

  const isUnitUsahaActive =
    activeTab === 'unit-usaha' ||
    activeTab === 'toko-saprodi' ||
    activeTab === 'sewa-alsintan' ||
    activeTab === 'agribisnis' ||
    activeTab === 'layanan-brilink';

  return (
    <>
      {/* Backdrop for Mobile */}
      {isActuallyOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar Aside */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isActuallyOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-16 px-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/40">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-sky-500 flex items-center justify-center text-white shadow-xs shrink-0">
              <Sprout className="w-5 h-5" />
            </div>
            <div className="truncate">
              <div className="font-bold text-white text-xs tracking-tight uppercase leading-tight truncate">
                Mitra Tani Berkah
              </div>
              <div className="text-[10px] text-blue-400 font-medium truncate">
                Koperasi Produsen
              </div>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menus List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Menu Utama Koperasi
          </div>

          {/* 1. Dashboard Utama */}
          <button
            id="nav-menu-dashboard"
            onClick={() => handleSelect('dashboard')}
            className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-slate-300 hover:bg-slate-800/90 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`p-1.5 rounded-lg shrink-0 ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-800 text-slate-400 group-hover:text-blue-400'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-xs truncate">Beranda Dashboard</div>
                <div className={`text-[10px] truncate ${activeTab === 'dashboard' ? 'text-blue-100' : 'text-slate-400'}`}>
                  Statistik & Notifikasi
                </div>
              </div>
            </div>
            {unreadNotifCount > 0 && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white">
                {unreadNotifCount}
              </span>
            )}
          </button>

          {/* 2. Profil Koperasi */}
          <button
            id="nav-menu-profil"
            onClick={() => handleSelect('profil')}
            className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
              activeTab === 'profil'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-slate-300 hover:bg-slate-800/90 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`p-1.5 rounded-lg shrink-0 ${
                  activeTab === 'profil'
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-800 text-slate-400 group-hover:text-blue-400'
                }`}
              >
                <Building2 className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-xs truncate">Profil Koperasi</div>
                <div className={`text-[10px] truncate ${activeTab === 'profil' ? 'text-blue-100' : 'text-slate-400'}`}>
                  SK & NIB Koperasi
                </div>
              </div>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 ${activeTab === 'profil' ? 'text-white' : 'text-slate-600'}`} />
          </button>

          {/* 3. Keanggotaan (93 Anggota) */}
          <button
            id="nav-menu-anggota"
            onClick={() => handleSelect('anggota')}
            className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
              activeTab === 'anggota'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-slate-300 hover:bg-slate-800/90 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`p-1.5 rounded-lg shrink-0 ${
                  activeTab === 'anggota'
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-800 text-slate-400 group-hover:text-blue-400'
                }`}
              >
                <Users className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-xs truncate">Manajemen Anggota</div>
                <div className={`text-[10px] truncate ${activeTab === 'anggota' ? 'text-blue-100' : 'text-slate-400'}`}>
                  93 Petani & Plafon
                </div>
              </div>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
              93
            </span>
          </button>

          {/* 4. Unit Usaha Terpadu (Parent with Accordion) */}
          <div className="pt-1">
            <div
              className={`w-full group flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                activeTab === 'unit-usaha'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : isUnitUsahaActive
                  ? 'bg-slate-800 text-white font-medium'
                  : 'text-slate-300 hover:bg-slate-800/90 hover:text-white'
              }`}
            >
              <button
                type="button"
                id="nav-menu-unit-usaha"
                onClick={() => {
                  handleSelect('unit-usaha');
                  setUnitUsahaExpanded(true);
                }}
                className="flex items-center gap-3 min-w-0 flex-1 text-left bg-transparent border-0 py-1 px-0 text-inherit cursor-pointer"
              >
                <div
                  className={`p-1.5 rounded-lg shrink-0 ${
                    isUnitUsahaActive
                      ? 'bg-blue-700 text-white'
                      : 'bg-slate-800 text-slate-400 group-hover:text-blue-400'
                  }`}
                >
                  <Store className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-xs truncate">Unit Usaha Terpadu</div>
                  <div className={`text-[10px] truncate ${isUnitUsahaActive ? 'text-blue-200' : 'text-slate-400'}`}>
                    5 Unit Usaha
                  </div>
                </div>
              </button>

              <button
                type="button"
                id="btn-toggle-unit-usaha-sidebar"
                onClick={e => {
                  e.stopPropagation();
                  setUnitUsahaExpanded(!unitUsahaExpanded);
                }}
                className="p-1 hover:bg-slate-700/50 rounded-md text-slate-400 hover:text-white shrink-0 cursor-pointer"
                title={unitUsahaExpanded ? 'Tutup sub-menu unit usaha' : 'Buka sub-menu unit usaha'}
                aria-label={unitUsahaExpanded ? 'Tutup sub-menu unit usaha' : 'Buka sub-menu unit usaha'}
              >
                {unitUsahaExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Sub-menu of Unit Usaha (Direct Click Access to each Unit) */}
            {unitUsahaExpanded && (
              <div className="pl-6 pr-1 pt-1 pb-1 space-y-1 border-l-2 border-slate-800 ml-4 my-1">
                {/* 4.1 Toko Saprodi */}
                <button
                  id="nav-sub-saprodi"
                  onClick={() => handleSelect('toko-saprodi')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors ${
                    activeTab === 'toko-saprodi'
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Store className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">Toko Saprodi</span>
                  </div>
                  {lowStockCount > 0 && (
                    <span className="px-1 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-300 font-bold">
                      {lowStockCount} tipis
                    </span>
                  )}
                </button>

                {/* 4.2 Sewa Alsintan */}
                <button
                  id="nav-sub-alsintan"
                  onClick={() => handleSelect('sewa-alsintan')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors ${
                    activeTab === 'sewa-alsintan'
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Tractor className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">Sewa Alsintan</span>
                  </div>
                </button>

                {/* 4.3 Agribisnis Sayuran */}
                <button
                  id="nav-sub-agribisnis"
                  onClick={() => handleSelect('agribisnis')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors ${
                    activeTab === 'agribisnis'
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Wheat className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">Agribisnis & Panen</span>
                  </div>
                  <span className="text-[9px] text-emerald-400 font-mono">WA</span>
                </button>

                {/* 4.4 Layanan Brilink */}
                <button
                  id="nav-sub-brilink"
                  onClick={() => handleSelect('layanan-brilink')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors ${
                    activeTab === 'layanan-brilink'
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Banknote className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="truncate">Layanan Brilink</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 5. Pinjaman Usaha Tani */}
          <button
            id="nav-menu-pinjaman"
            onClick={() => handleSelect('pinjaman')}
            className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
              activeTab === 'pinjaman'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-slate-300 hover:bg-slate-800/90 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`p-1.5 rounded-lg shrink-0 ${
                  activeTab === 'pinjaman'
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-800 text-slate-400 group-hover:text-blue-400'
                }`}
              >
                <CreditCard className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-xs truncate">Pinjaman Anggota</div>
                <div className={`text-[10px] truncate ${activeTab === 'pinjaman' ? 'text-blue-100' : 'text-slate-400'}`}>
                  Validasi Plafon 2x
                </div>
              </div>
            </div>
            {pendingLoansCount > 0 && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950">
                {pendingLoansCount}
              </span>
            )}
          </button>

          {/* 6. Keuangan & Margin & SHU */}
          <button
            id="nav-menu-keuangan"
            onClick={() => handleSelect('keuangan')}
            className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
              activeTab === 'keuangan'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-slate-300 hover:bg-slate-800/90 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`p-1.5 rounded-lg shrink-0 ${
                  activeTab === 'keuangan'
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-800 text-slate-400 group-hover:text-blue-400'
                }`}
              >
                <PieChart className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-xs truncate">Keuangan & SHU</div>
                <div className={`text-[10px] truncate ${activeTab === 'keuangan' ? 'text-blue-100' : 'text-slate-400'}`}>
                  Laba Rugi & Zakat
                </div>
              </div>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 ${activeTab === 'keuangan' ? 'text-white' : 'text-slate-600'}`} />
          </button>

          {/* 7. Laporan Simpanan */}
          <button
            id="nav-menu-laporan"
            onClick={() => handleSelect('laporan-simpanan')}
            className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
              activeTab === 'laporan-simpanan'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-slate-300 hover:bg-slate-800/90 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`p-1.5 rounded-lg shrink-0 ${
                  activeTab === 'laporan-simpanan'
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-800 text-slate-400 group-hover:text-blue-400'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-xs truncate">Pusat Laporan</div>
                <div className={`text-[10px] truncate ${activeTab === 'laporan-simpanan' ? 'text-blue-100' : 'text-slate-400'}`}>
                  Excel, Word, PDF
                </div>
              </div>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 ${activeTab === 'laporan-simpanan' ? 'text-white' : 'text-slate-600'}`} />
          </button>

          {/* 8. Admin & Database Supabase */}
          <button
            id="nav-menu-admin"
            onClick={() => handleSelect('admin')}
            className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
              activeTab === 'admin'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-slate-300 hover:bg-slate-800/90 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`p-1.5 rounded-lg shrink-0 ${
                  activeTab === 'admin'
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-800 text-slate-400 group-hover:text-blue-400'
                }`}
              >
                <Settings className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-xs truncate">Admin & Supabase</div>
                <div className={`text-[10px] truncate ${activeTab === 'admin' ? 'text-blue-100' : 'text-slate-400'}`}>
                  Role, SQL & Hosting
                </div>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </button>
        </div>

        {/* Footer info in sidebar */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 shrink-0">
          <div className="rounded-xl p-2.5 bg-slate-900 border border-slate-800 text-[11px]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span>Status Sistem</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Online
              </span>
            </div>
            <div className="text-slate-300 font-medium truncate">
              Koperasi Mitra Tani Berkah
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
              SK: AHU-0004819.AH.01.26
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
