import React, { useState } from 'react';
import { KoperasiProvider, useKoperasi } from './context/KoperasiContext';
import { Sidebar, ActiveTabType } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { ProfilKoperasiView } from './components/profil/ProfilKoperasiView';
import { AnggotaView } from './components/anggota/AnggotaView';
import { UnitUsahaContainer } from './components/unit-usaha/UnitUsahaContainer';
import { PinjamanView } from './components/pinjaman/PinjamanView';
import { KeuanganView } from './components/keuangan/KeuanganView';
import { LaporanView } from './components/laporan/LaporanView';
import { AdminRoleView } from './components/admin/AdminRoleView';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { AdminLoginScreen } from './components/auth/AdminLoginScreen';
import { ToastContainer } from './components/common/ToastContainer';
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
  Shield,
  Home
} from 'lucide-react';

function MainAppContent() {
  const { isAdminLoggedIn } = useKoperasi();
  const [activeTab, setActiveTab] = useState<ActiveTabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Quick tabs list for top horizontal navigation bar (numbers removed as requested)
  const mainTabs: { id: ActiveTabType; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profil', label: 'Profil Koperasi', icon: Building2 },
    { id: 'anggota', label: 'Keanggotaan', icon: Users },
    { id: 'unit-usaha', label: 'Unit Usaha', icon: Store },
    { id: 'pinjaman', label: 'Pinjaman', icon: CreditCard },
    { id: 'keuangan', label: 'Keuangan & SHU', icon: PieChart },
    { id: 'laporan-simpanan', label: 'Pusat Laporan', icon: FileSpreadsheet },
    { id: 'admin', label: 'Admin & Supabase', icon: Settings },
  ];

  // If admin is not logged in, show the secure Admin Login Portal first
  if (!isAdminLoggedIn) {
    return (
      <>
        <AdminLoginScreen />
        <ToastContainer />
      </>
    );
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            onNavigate={tab => setActiveTab(tab)}
            onOpenNotifications={() => setNotificationOpen(true)}
          />
        );
      case 'profil':
        return <ProfilKoperasiView />;
      case 'anggota':
        return <AnggotaView />;
      case 'unit-usaha':
        return <UnitUsahaContainer initialSubTab="agribisnis" />;
      case 'toko-saprodi':
        return <UnitUsahaContainer initialSubTab="saprodi" />;
      case 'sewa-alsintan':
        return <UnitUsahaContainer initialSubTab="alsintan" />;
      case 'agribisnis':
        return <UnitUsahaContainer initialSubTab="agribisnis" />;
      case 'layanan-brilink':
        return <UnitUsahaContainer initialSubTab="brilink" />;
      case 'pinjaman':
        return <PinjamanView />;
      case 'keuangan':
        return <KeuanganView />;
      case 'laporan-simpanan':
        return <LaporanView />;
      case 'admin':
      case 'admin-role' as ActiveTabType:
        return <AdminRoleView />;
      default:
        return (
          <DashboardView
            onNavigate={tab => setActiveTab(tab)}
            onOpenNotifications={() => setNotificationOpen(true)}
          />
        );
    }
  };

  // Determine current active main tab label for breadcrumb
  const getTabTitle = (tab: ActiveTabType): string => {
    switch (tab) {
      case 'dashboard':
        return 'Dashboard Utama (Beranda)';
      case 'profil':
        return 'Profil Legalitas & Identitas Koperasi';
      case 'anggota':
        return 'Manajemen 93 Anggota Petani & Saldo Simpanan';
      case 'unit-usaha':
        return 'Unit Usaha Terpadu (5 Unit Usaha)';
      case 'toko-saprodi':
        return 'Unit Usaha: Toko Saprodi & Stok Pertanian';
      case 'sewa-alsintan':
        return 'Unit Usaha: Sewa Alat & Mesin Pertanian (Alsintan)';
      case 'agribisnis':
        return 'Unit Usaha: Agribisnis Sayuran & Transaksi Panen';
      case 'layanan-brilink':
        return 'Unit Usaha: Loket Layanan Keuangan Desa Brilink';
      case 'pinjaman':
        return 'Simpan Pinjam Usaha Tani (Plafon 2x Simpanan)';
      case 'keuangan':
        return 'Laporan Laba Rugi, Zakat & Pembagian SHU';
      case 'laporan-simpanan':
        return 'Pusat Laporan Keuangan (Excel, Word, PDF)';
      case 'admin':
        return 'Manajemen Role Pengurus & Integrasi Supabase Cloud';
      default:
        return 'Dashboard Utama';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={tab => {
          setActiveTab(tab);
          setSidebarOpen(false);
        }}
        onSelectTab={tab => {
          setActiveTab(tab);
          setSidebarOpen(false);
        }}
        isOpen={sidebarOpen}
        isOpenMobile={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      {/* Main Body Container */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          isSidebarOpen={sidebarOpen}
          onOpenNotifications={() => setNotificationOpen(true)}
          onOpenSupabaseModal={() => setActiveTab('admin')}
          onNavigate={tab => setActiveTab(tab)}
        />

        {/* Top Quick Navigation Bar (Horizontal Menu Strip for Fast Access) */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 shadow-2xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Scrollable menu buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar scroll-smooth">
              {mainTabs.map(item => {
                const Icon = item.icon;
                const isItemActive =
                  activeTab === item.id ||
                  (item.id === 'unit-usaha' &&
                    ['toko-saprodi', 'sewa-alsintan', 'agribisnis', 'layanan-brilink'].includes(
                      activeTab
                    ));

                return (
                  <button
                    key={item.id}
                    id={`top-nav-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      isItemActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Current Active Indicator */}
            <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-500 font-medium shrink-0">
              <Home className="w-3.5 h-3.5 text-slate-400" />
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-blue-600 font-semibold truncate max-w-xs">
                {getTabTitle(activeTab)}
              </span>
            </div>
          </div>
        </div>

        {/* View Content */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>

        {/* Footer */}
        <footer className="py-4 px-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              © 2024 - 2029 <strong>KOPERASI PRODUSEN MITRA TANI BERKAH</strong>. Hak Cipta Dilindungi.
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span>SK Kemenkumham: AHU-0004819.AH.01.26</span>
              <span>•</span>
              <span>NIB: 1904230058291</span>
              <span>•</span>
              <button
                onClick={() => setActiveTab('admin')}
                className="text-blue-600 hover:underline font-semibold"
              >
                Panel Supabase Cloud & Deploy
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Modern Notification Drawer */}
      <NotificationDrawer
        isOpen={notificationOpen}
        onClose={() => setNotificationOpen(false)}
      />

      {/* Global Interactive Notification Pop-up Toasts */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <KoperasiProvider>
      <MainAppContent />
    </KoperasiProvider>
  );
}
