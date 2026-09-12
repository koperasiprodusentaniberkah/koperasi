import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Anggota,
  CommodityPrice,
  PanenTransaction,
  SaprodiItem,
  SaprodiCashFlow,
  SaprodiTransaction,
  AlsintanItem,
  AlsintanRental,
  BrilinkTransaction,
  LoanApplication,
  SavingsCashFlow,
  OperationalExpense,
  NotificationItem,
  RoleType,
  UserAccount,
  SupabaseConfig,
  ToastItem,
  BudidayaReport
} from '../types/koperasi';

import {
  INITIAL_93_MEMBERS,
  INITIAL_COMMODITY_PRICES,
  INITIAL_SAPRODI_ITEMS,
  INITIAL_SAPRODI_CASHFLOW,
  INITIAL_SAPRODI_TRANSACTIONS,
  INITIAL_ALSINTAN_ITEMS,
  INITIAL_ALSINTAN_RENTALS,
  INITIAL_PANEN_TRANSACTIONS,
  INITIAL_BRILINK_TRANSACTIONS,
  INITIAL_LOAN_APPLICATIONS,
  INITIAL_SAVINGS_CASHFLOW,
  INITIAL_OPERATIONAL_EXPENSE,
  INITIAL_NOTIFICATIONS,
  INITIAL_USERS,
  INITIAL_BUDIDAYA_REPORTS
} from '../data/initialData';

import { getStoredSupabaseConfig, saveSupabaseConfig } from '../utils/supabaseClient';

interface KoperasiContextType {
  // Anggota
  anggotaList: Anggota[];
  tambahAnggota: (data: Omit<Anggota, 'id' | 'nomorAnggota' | 'tanggalDaftar'>) => Anggota;
  updateAnggota: (id: string, data: Partial<Anggota>) => void;
  hapusAnggota: (id: string) => void;
  getNextNomorAnggota: () => string;

  // Informasi Budidaya Anggota
  budidayaReports: BudidayaReport[];
  tambahLaporanBudidaya: (data: Omit<BudidayaReport, 'id' | 'kodeLaporan' | 'tanggalLaporan' | 'tanggalUpdate'>) => BudidayaReport;
  updateLaporanBudidaya: (id: string, data: Partial<BudidayaReport>) => void;
  hapusLaporanBudidaya: (id: string) => void;
  bagikanFormBudidaya: (targetOption: 'semua' | 'whatsapp', pesanKhusus?: string) => void;

  // Harga Komoditas
  commodityPrices: CommodityPrice[];
  updateHargaKomoditas: (id: string, hargaBaru: number, keterangan?: string) => void;

  // Agribisnis & Panen
  panenList: PanenTransaction[];
  tambahTransaksiPanen: (data: {
    anggotaId: string;
    komoditas: string;
    beratKg: number;
    hargaPerKg: number;
    tipePenjualan: 'Koperasi Mandiri' | 'BUMDes';
    catatan?: string;
  }) => PanenTransaction;
  hapusTransaksiPanen: (id: string) => void;

  // Saprodi
  saprodiItems: SaprodiItem[];
  tambahBarangSaprodi: (data: Omit<SaprodiItem, 'id' | 'margin' | 'marginPersen' | 'tanggalUpdate'>) => void;
  updateBarangSaprodi: (id: string, data: Partial<SaprodiItem>) => void;
  hapusBarangSaprodi: (id: string) => void;
  saprodiCashflow: SaprodiCashFlow[];
  tambahArusKasSaprodi: (data: Omit<SaprodiCashFlow, 'id' | 'tanggal'>) => void;
  saprodiTransactions: SaprodiTransaction[];
  tambahTransaksiSaprodi: (data: {
    tipe: 'Penjualan' | 'Pembelian';
    barangId: string;
    jumlah: number;
    hargaSatuan: number;
    namaPihak: string;
    tipePihak: 'Anggota' | 'Non-Anggota' | 'Supplier / Distributor';
    anggotaId?: string;
    noHp?: string;
    metodePembayaran: 'Tunai' | 'Transfer Bank' | 'Potong Simpanan Sukarela';
    catatan?: string;
    updateHargaBeliMaster?: boolean;
  }) => SaprodiTransaction;
  hapusTransaksiSaprodi: (id: string) => void;

  // Alsintan
  alsintanItems: AlsintanItem[];
  tambahAlsintan: (data: Omit<AlsintanItem, 'id'>) => void;
  updateAlsintan: (id: string, data: Partial<AlsintanItem>) => void;
  hapusAlsintan: (id: string) => void;
  alsintanRentals: AlsintanRental[];
  tambahSewaAlsintan: (data: {
    alsintanId: string;
    anggotaId: string;
    durasi: number;
    satuanDurasi: 'Hari' | 'Jam';
  }) => void;
  selesaikanSewaAlsintan: (rentalId: string) => void;
  hapusSewaAlsintan: (rentalId: string) => void;

  // Brilink
  brilinkList: BrilinkTransaction[];
  tambahTransaksiBrilink: (data: Omit<BrilinkTransaction, 'id' | 'kodeTransaksi' | 'tanggal'>) => void;
  hapusTransaksiBrilink: (id: string) => void;

  // Pinjaman
  loans: LoanApplication[];
  ajukanPinjaman: (data: {
    anggotaId: string;
    jumlahPinjaman: number;
    tenorBulan: number;
    tujuanPinjaman: string;
  }) => { success: boolean; message: string; loan?: LoanApplication };
  verifikasiPinjaman: (loanId: string, status: 'Disetujui' | 'Ditolak') => void;
  cairkanPinjaman: (loanId: string) => void;
  hapusPinjaman: (loanId: string) => void;
  bayarAngsuranPinjaman: (loanId: string, jumlahAngsuran: number, metode?: string) => void;

  // Simpanan & Arus Kas
  savingsCashflow: SavingsCashFlow[];
  tambahSimpananManual: (data: {
    anggotaId: string;
    jenisSimpanan: 'Simpanan Pokok' | 'Simpanan Wajib' | 'Simpanan Sukarela' | 'Penyertaan Modal Ketahanan Pangan';
    tipe: 'Masuk' | 'Keluar';
    jumlah: number;
    keterangan: string;
    metode: 'Tunai' | 'Potongan Panen' | 'Transfer';
  }) => void;
  hapusSimpananCashflow: (id: string) => void;

  // Operasional & Modal
  operationalExpense: OperationalExpense;
  updateOperationalExpense: (data: Partial<OperationalExpense>) => void;

  // Notifikasi
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  tambahNotifikasi: (notif: Omit<NotificationItem, 'id' | 'waktu' | 'dibaca'>) => void;

  // Authentication & Member Access (93 Anggota & Pengurus)
  isAdminLoggedIn: boolean;
  isLoggedIn: boolean;
  authType: 'admin' | 'anggota' | null;
  activeAnggota: Anggota | null;
  unlockedPinMemberIds: string[];
  loginAdmin: (username: string, password?: string) => boolean;
  logoutAdmin: () => void;
  loginAnggota: (identifier: string, kataSandi: string) => { success: boolean; message: string; anggota?: Anggota };
  verifyMemberPin: (targetAnggotaId: string, inputPin: string) => { success: boolean; message: string };
  isPinUnlockedFor: (anggotaId: string) => boolean;
  lockMemberPin: (anggotaId?: string) => void;
  logout: () => void;

  // Pop-up Toast Notifications
  toastList: ToastItem[];
  showToast: (title: string, message: string, type?: 'success' | 'delete' | 'info' | 'warning') => void;
  dismissToast: (id: string) => void;

  // Users & Roles
  currentUser: UserAccount;
  setCurrentUserRole: (role: RoleType) => void;
  usersList: UserAccount[];

  // Supabase Config & Tools
  supabaseConfig: SupabaseConfig;
  updateSupabaseConfig: (config: SupabaseConfig) => void;
  resetAllDataToDefault: () => void;

  // Calculated Financial Metrics
  hitungStatistikKeuangan: () => {
    totalAnggotaAktif: number;
    totalAnggotaNonAktif: number;
    totalSimpananPokok: number;
    totalSimpananWajib: number;
    totalSimpananSukarela: number;
    totalModalKetahananPangan: number;
    totalAkumulasiSimpanan: number;
    totalPinjamanBerjalan: number;
    pendapatanSharingProfitSayuran: number;
    pendapatanBumdesSayuran: number;
    pendapatanSaprodiKotor: number;
    danaTaktisSaprodi10Persen: number;
    pendapatanSaprodiNetto: number;
    pendapatanSewaAlsintan: number;
    pendapatanFeeBrilink: number;
    pendapatanJasaPinjaman: number;
    totalPendapatanBruto: number;
    totalOperasionalBulanan: number;
    pendapatanBersihSebelumZakat: number;
    potonganZakat2_5: number;
    pendapatanBersihSetelahZakat: number;
    alokasiSHU35: number;
    alokasiPembinaan5: number;
    alokasiBOP30: number;
    alokasiCadangan30: number;
  };
}

const KoperasiContext = createContext<KoperasiContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'kop_produsen_mitra_tani_berkah_v1';

export const KoperasiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from local storage or use defaults
  const [anggotaList, setAnggotaList] = useState<Anggota[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_anggota`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((m: any, idx: number) => {
            const num = idx + 1;
            const num2 = String(num).padStart(2, '0');
            return {
              ...m,
              userId: m.userId || `petani${num2}`,
              kataSandi: m.kataSandi || `Tani#${num2}`,
              pinKhusus: m.pinKhusus || `12${num2}${num2}`
            };
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_93_MEMBERS;
  });

  const [commodityPrices, setCommodityPrices] = useState<CommodityPrice[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_prices`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_COMMODITY_PRICES;
  });

  const [panenList, setPanenList] = useState<PanenTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_panen`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PANEN_TRANSACTIONS;
  });

  const [saprodiItems, setSaprodiItems] = useState<SaprodiItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_saprodi`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SAPRODI_ITEMS;
  });

  const [saprodiCashflow, setSaprodiCashflow] = useState<SaprodiCashFlow[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_saprodi_cf`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SAPRODI_CASHFLOW;
  });

  const [saprodiTransactions, setSaprodiTransactions] = useState<SaprodiTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_saprodi_trx`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SAPRODI_TRANSACTIONS;
  });

  const [alsintanItems, setAlsintanItems] = useState<AlsintanItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_alsintan`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ALSINTAN_ITEMS;
  });

  const [alsintanRentals, setAlsintanRentals] = useState<AlsintanRental[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_alsintan_rent`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ALSINTAN_RENTALS;
  });

  const [brilinkList, setBrilinkList] = useState<BrilinkTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_brilink`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_BRILINK_TRANSACTIONS;
  });

  const [loans, setLoans] = useState<LoanApplication[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_loans`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_LOAN_APPLICATIONS;
  });

  const [savingsCashflow, setSavingsCashflow] = useState<SavingsCashFlow[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_savings_cf`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SAVINGS_CASHFLOW;
  });

  const [operationalExpense, setOperationalExpense] = useState<OperationalExpense>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_ops`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_OPERATIONAL_EXPENSE;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_notifs`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [budidayaReports, setBudidayaReports] = useState<BudidayaReport[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_budidaya`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_BUDIDAYA_REPORTS;
  });

  const [usersList] = useState<UserAccount[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserAccount>(INITIAL_USERS[1]); // Super Admin default
  const [supabaseConfig, setSupabaseConfigState] = useState<SupabaseConfig>(getStoredSupabaseConfig);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_anggota`, JSON.stringify(anggotaList));
  }, [anggotaList]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_prices`, JSON.stringify(commodityPrices));
  }, [commodityPrices]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_panen`, JSON.stringify(panenList));
  }, [panenList]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_saprodi`, JSON.stringify(saprodiItems));
  }, [saprodiItems]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_saprodi_cf`, JSON.stringify(saprodiCashflow));
  }, [saprodiCashflow]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_saprodi_trx`, JSON.stringify(saprodiTransactions));
  }, [saprodiTransactions]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_alsintan`, JSON.stringify(alsintanItems));
  }, [alsintanItems]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_alsintan_rent`, JSON.stringify(alsintanRentals));
  }, [alsintanRentals]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_brilink`, JSON.stringify(brilinkList));
  }, [brilinkList]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_loans`, JSON.stringify(loans));
  }, [loans]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_savings_cf`, JSON.stringify(savingsCashflow));
  }, [savingsCashflow]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_ops`, JSON.stringify(operationalExpense));
  }, [operationalExpense]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_notifs`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_budidaya`, JSON.stringify(budidayaReports));
  }, [budidayaReports]);

  // Admin & Member Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_admin_auth`);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [authType, setAuthType] = useState<'admin' | 'anggota' | null>(() => {
    try {
      const savedType = localStorage.getItem(`${LOCAL_STORAGE_KEY}_auth_type`);
      if (savedType === 'anggota' || savedType === 'admin') return savedType;
      return 'admin';
    } catch {
      return 'admin';
    }
  });

  const [activeAnggota, setActiveAnggota] = useState<Anggota | null>(null);
  const [unlockedPinMemberIds, setUnlockedPinMemberIds] = useState<string[]>([]);

  // Synchronize activeAnggota from localStorage when anggotaList is loaded
  useEffect(() => {
    try {
      const savedId = localStorage.getItem(`${LOCAL_STORAGE_KEY}_active_anggota_id`);
      if (savedId && authType === 'anggota') {
        const found = anggotaList.find(a => a.id === savedId);
        if (found) {
          setActiveAnggota(found);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [anggotaList, authType]);

  // Pop-up Toast Notifications State
  const [toastList, setToastList] = useState<ToastItem[]>([]);

  const showToast = (
    title: string,
    message: string,
    type: 'success' | 'delete' | 'info' | 'warning' = 'success'
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const newToast: ToastItem = {
      id,
      title,
      message,
      type,
      timestamp: timeStr
    };

    setToastList(prev => [newToast, ...prev.slice(0, 4)]);

    // Auto dismiss after 4.5 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToastList(prev => prev.filter(t => t.id !== id));
  };

  const loginAdmin = (username: string, password?: string): boolean => {
    const validUser = (username || '').trim().toLowerCase() === 'admin';
    const pwd = (password || '').trim();
    const validPwd = pwd === 'admin' || pwd === 'admin123' || pwd === '';

    if (validUser && validPwd) {
      setIsAdminLoggedIn(true);
      setAuthType('admin');
      setActiveAnggota(null);
      setCurrentUser(INITIAL_USERS[1]); // Super Admin
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_admin_auth`, 'true');
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_auth_type`, 'admin');
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}_active_anggota_id`);
      showToast('Login Admin Berhasil', 'Selamat datang di Panel Manajemen Koperasi Mitra Tani Berkah.', 'success');
      return true;
    }
    showToast('Login Gagal', 'Username atau kata sandi admin tidak valid.', 'warning');
    return false;
  };

  const loginAnggota = (
    identifier: string,
    kataSandi: string
  ): { success: boolean; message: string; anggota?: Anggota } => {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (kataSandi || '').trim();

    if (!cleanId) {
      showToast('User ID Wajib Diisi', 'Silakan masukkan User ID akun anggota Anda.', 'warning');
      return { success: false, message: 'User ID tidak boleh kosong.' };
    }
    if (!cleanPass) {
      showToast('Kata Sandi Wajib Diisi', 'Silakan masukkan Kata Sandi Khusus Anda.', 'warning');
      return { success: false, message: 'Kata Sandi Khusus tidak boleh kosong.' };
    }

    const member = anggotaList.find(
      a =>
        a.userId.toLowerCase() === cleanId ||
        a.nomorAnggota.toLowerCase() === cleanId ||
        a.nik === cleanId
    );

    if (!member) {
      showToast('Login Gagal', `Akun "${identifier}" tidak ditemukan dalam 93 anggota terdaftar.`, 'warning');
      return { success: false, message: `User ID "${identifier}" tidak ditemukan dalam 93 anggota.` };
    }

    if (member.kataSandi !== cleanPass) {
      showToast('Kata Sandi Salah', 'Kata Sandi Khusus yang Anda masukkan salah.', 'warning');
      return { success: false, message: 'Kata Sandi Khusus tidak cocok. Silakan coba lagi.' };
    }

    // Success login as member
    setIsAdminLoggedIn(true);
    setAuthType('anggota');
    setActiveAnggota(member);
    setCurrentUser({
      id: member.id,
      nama: member.nama,
      email: `${member.userId}@mitrataniberkah.id`,
      role: 'Anggota Tani',
      status: member.status === 'Aktif' ? 'Aktif' : 'Non-Aktif'
    });

    localStorage.setItem(`${LOCAL_STORAGE_KEY}_admin_auth`, 'true');
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_auth_type`, 'anggota');
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_active_anggota_id`, member.id);

    showToast('Login Berhasil', `Selamat datang, ${member.nama}! Anda masuk sebagai Anggota Koperasi.`, 'success');
    return { success: true, message: `Selamat datang, ${member.nama}!`, anggota: member };
  };

  const verifyMemberPin = (
    targetAnggotaId: string,
    inputPin: string
  ): { success: boolean; message: string } => {
    // Privacy protection: Anggota cannot inspect other members' loan data!
    if (authType === 'anggota' && activeAnggota && activeAnggota.id !== targetAnggotaId) {
      const target = anggotaList.find(a => a.id === targetAnggotaId);
      const targetName = target ? target.nama : 'anggota lain';
      showToast('Akses Ditolak', `Privasi Terlindungi: Anda tidak dapat mengakses data pinjaman ${targetName}.`, 'warning');
      return {
        success: false,
        message: `Akses Ditolak: Anda sedang login sebagai ${activeAnggota.nama}. Sesuai aturan privasi, Anda hanya diizinkan membuka data pinjaman pribadi milik Anda sendiri.`
      };
    }

    const targetMember = anggotaList.find(a => a.id === targetAnggotaId);
    if (!targetMember) {
      return { success: false, message: 'Data anggota tidak ditemukan.' };
    }

    const cleanPin = (inputPin || '').trim();
    if (cleanPin === targetMember.pinKhusus) {
      setUnlockedPinMemberIds(prev => Array.from(new Set([...prev, targetAnggotaId])));
      showToast('PIN Terverifikasi', `Akses data pinjaman pribadi ${targetMember.nama} berhasil dibuka.`, 'success');
      return { success: true, message: 'PIN Khusus cocok! Rincian pinjaman terbuka.' };
    }

    showToast('PIN Khusus Salah', 'PIN Khusus yang Anda masukkan tidak sesuai.', 'warning');
    return { success: false, message: 'PIN Khusus salah! Silakan periksa kembali 6 digit PIN rahasia Anda.' };
  };

  const isPinUnlockedFor = (anggotaId: string): boolean => {
    return unlockedPinMemberIds.includes(anggotaId);
  };

  const lockMemberPin = (anggotaId?: string) => {
    if (anggotaId) {
      setUnlockedPinMemberIds(prev => prev.filter(id => id !== anggotaId));
    } else {
      setUnlockedPinMemberIds([]);
    }
  };

  const logout = () => {
    setIsAdminLoggedIn(false);
    setAuthType(null);
    setActiveAnggota(null);
    setUnlockedPinMemberIds([]);
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_admin_auth`, 'false');
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_auth_type`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_active_anggota_id`);
    showToast('Keluar Berhasil', 'Anda telah berhasil keluar dari sistem koperasi.', 'info');
  };

  const logoutAdmin = () => {
    logout();
  };

  // Reset to initial state
  const resetAllDataToDefault = () => {
    setAnggotaList(INITIAL_93_MEMBERS);
    setCommodityPrices(INITIAL_COMMODITY_PRICES);
    setPanenList(INITIAL_PANEN_TRANSACTIONS);
    setSaprodiItems(INITIAL_SAPRODI_ITEMS);
    setSaprodiCashflow(INITIAL_SAPRODI_CASHFLOW);
    setSaprodiTransactions(INITIAL_SAPRODI_TRANSACTIONS);
    setAlsintanItems(INITIAL_ALSINTAN_ITEMS);
    setAlsintanRentals(INITIAL_ALSINTAN_RENTALS);
    setBrilinkList(INITIAL_BRILINK_TRANSACTIONS);
    setLoans(INITIAL_LOAN_APPLICATIONS);
    setSavingsCashflow(INITIAL_SAVINGS_CASHFLOW);
    setOperationalExpense(INITIAL_OPERATIONAL_EXPENSE);
    setNotifications(INITIAL_NOTIFICATIONS);
    setBudidayaReports(INITIAL_BUDIDAYA_REPORTS);
    showToast('Data Berhasil Direset', 'Semua data koperasi dikembalikan ke setelan default 93 anggota.', 'info');
  };

  const getNextNomorAnggota = (): string => {
    const nextNum = anggotaList.length + 1;
    return `KOP-MTB ${String(nextNum).padStart(4, '0')}`;
  };

  const tambahNotifikasi = (notif: Omit<NotificationItem, 'id' | 'waktu' | 'dibaca'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `ntf-${Date.now()}`,
      waktu: 'Baru saja',
      dibaca: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, dibaca: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, dibaca: true })));
  };

  const setCurrentUserRole = (role: RoleType) => {
    const match = usersList.find(u => u.role === role);
    if (match) {
      setCurrentUser(match);
    } else {
      setCurrentUser(prev => ({ ...prev, role }));
    }
  };

  const updateSupabaseConfig = (config: SupabaseConfig) => {
    setSupabaseConfigState(config);
    saveSupabaseConfig(config);
    showToast('Koneksi Supabase Disimpan', 'Konfigurasi database cloud Supabase berhasil disimpan.', 'success');
  };

  // Anggota CRUD
  const tambahAnggota = (data: Omit<Anggota, 'id' | 'nomorAnggota' | 'tanggalDaftar'>): Anggota => {
    const nomorAnggota = getNextNomorAnggota();
    const today = new Date().toISOString().split('T')[0];
    const newAnggota: Anggota = {
      ...data,
      id: `agt-${Date.now()}`,
      nomorAnggota,
      // Ketentuan Wajib: Pembayaran Simpanan Pokok Rp 100.000 (hanya dibayar 1x di awal)
      simpananPokok: 100000,
      tanggalDaftar: today
    };

    setAnggotaList(prev => [newAnggota, ...prev]);

    // Record the Simpanan Pokok entry to savings cash flow
    const cashflowEntry: SavingsCashFlow = {
      id: `sav-${Date.now()}`,
      tanggal: today,
      anggotaId: newAnggota.id,
      namaAnggota: newAnggota.nama,
      jenisSimpanan: 'Simpanan Pokok',
      tipe: 'Masuk',
      jumlah: 100000,
      keterangan: `Pembayaran Simpanan Pokok awal pendaftaran anggota baru (${newAnggota.nomorAnggota})`,
      metode: 'Tunai'
    };
    setSavingsCashflow(prev => [cashflowEntry, ...prev]);

    tambahNotifikasi({
      judul: 'Anggota Baru Terdaftar',
      pesan: `${newAnggota.nama} resmi terdaftar dengan nomor ${newAnggota.nomorAnggota} dan melunasi Simpanan Pokok Rp 100.000.`,
      tipe: 'anggota',
      targetModul: 'anggota'
    });

    showToast(
      'Anggota Baru Berhasil Didaftarkan',
      `${newAnggota.nama} (${newAnggota.nomorAnggota}) tersimpan, Simpanan Pokok Rp 100.000 tercatat.`,
      'success'
    );

    return newAnggota;
  };

  const updateAnggota = (id: string, data: Partial<Anggota>) => {
    setAnggotaList(prev =>
      prev.map(a => (a.id === id ? { ...a, ...data } : a))
    );
    showToast('Data Anggota Diperbarui', 'Perubahan data anggota koperasi berhasil disimpan.', 'success');
  };

  const hapusAnggota = (id: string) => {
    const target = anggotaList.find(a => a.id === id);
    const nama = target ? target.nama : 'Anggota';
    setAnggotaList(prev => prev.filter(a => a.id !== id));
    showToast('Anggota Dihapus', `${nama} telah dihapus dari basis data keanggotaan.`, 'delete');
  };

  // Commodity price update
  const updateHargaKomoditas = (id: string, hargaBaru: number, keterangan?: string) => {
    const today = new Date().toISOString().split('T')[0];
    setCommodityPrices(prev =>
      prev.map(p => {
        if (p.id === id) {
          return {
            ...p,
            hargaAcuan: hargaBaru,
            tanggalUpdate: today,
            keterangan: keterangan || p.keterangan
          };
        }
        return p;
      })
    );

    tambahNotifikasi({
      judul: 'Pembaruan Harga Acuan Harian',
      pesan: `Harga acuan komoditas telah disesuaikan menjadi Rp ${hargaBaru.toLocaleString('id-ID')}/Kg.`,
      tipe: 'info',
      targetModul: 'agribisnis'
    });

    showToast('Harga Pasar Diperbarui', `Harga acuan komoditas berhasil disesuaikan ke Rp ${hargaBaru.toLocaleString('id-ID')}/Kg.`, 'info');
  };

  // Panen Transaction & Auto Deduction
  const tambahTransaksiPanen = (data: {
    anggotaId: string;
    komoditas: string;
    beratKg: number;
    hargaPerKg: number;
    tipePenjualan: 'Koperasi Mandiri' | 'BUMDes';
    catatan?: string;
  }): PanenTransaction => {
    const anggota = anggotaList.find(a => a.id === data.anggotaId);
    const namaAnggota = anggota ? anggota.nama : 'Petani Mitra';
    const noHp = anggota ? anggota.noHp : '';

    // Check if category is percabaian or sayuran_lain
    const isPercabaian = 
      data.komoditas.toLowerCase().includes('cabai') || 
      data.komoditas.toLowerCase().includes('cabe');

    const kategoriKomoditas = isPercabaian ? 'percabaian' : 'sayuran_lain';

    // Rules from prompt:
    // Percabaian: Rp 500/kg (Rp 400 Sukarela, Rp 100 Wajib)
    // Non-Percabaian: Rp 150/kg (Rp 100 Sukarela, Rp 50 Wajib)
    const tarifSukarela = isPercabaian ? 400 : 100;
    const tarifWajib = isPercabaian ? 100 : 50;

    const potonganSukarela = data.beratKg * tarifSukarela;
    const potonganWajib = data.beratKg * tarifWajib;
    const totalPotongan = potonganSukarela + potonganWajib;

    const subtotal = data.beratKg * data.hargaPerKg;
    const totalBersihPetani = subtotal - totalPotongan;

    // Sharing Profit (Rp 100 - Rp 500/kg)
    const marginSharingPerKg = isPercabaian ? 350 : 200;
    const sharingProfitKoperasi = data.beratKg * marginSharingPerKg;

    const today = new Date().toISOString().split('T')[0];
    const kodeNota = `NOTA-PNN-${Date.now().toString().slice(-6)}`;

    const newPanen: PanenTransaction = {
      id: `pn-${Date.now()}`,
      kodeNota,
      tanggal: today,
      anggotaId: data.anggotaId,
      namaAnggota,
      noHp,
      komoditas: data.komoditas,
      kategoriKomoditas,
      beratKg: data.beratKg,
      hargaPerKg: data.hargaPerKg,
      subtotal,
      potonganSukarela,
      potonganWajib,
      totalPotongan,
      totalBersihPetani,
      sharingProfitKoperasi,
      tipePenjualan: data.tipePenjualan,
      catatan: data.catatan
    };

    setPanenList(prev => [newPanen, ...prev]);

    // Automatically update the member's savings!
    if (anggota) {
      updateAnggota(anggota.id, {
        simpananSukarela: anggota.simpananSukarela + potonganSukarela,
        simpananWajib: anggota.simpananWajib + potonganWajib
      });

      // Add to savings cash flow
      const cfSukarela: SavingsCashFlow = {
        id: `sav-${Date.now()}-1`,
        tanggal: today,
        anggotaId: anggota.id,
        namaAnggota: anggota.nama,
        jenisSimpanan: 'Simpanan Sukarela',
        tipe: 'Masuk',
        jumlah: potonganSukarela,
        keterangan: `Autodebet panen ${data.komoditas} (${data.beratKg} Kg x Rp ${tarifSukarela})`,
        metode: 'Potongan Panen'
      };

      const cfWajib: SavingsCashFlow = {
        id: `sav-${Date.now()}-2`,
        tanggal: today,
        anggotaId: anggota.id,
        namaAnggota: anggota.nama,
        jenisSimpanan: 'Simpanan Wajib',
        tipe: 'Masuk',
        jumlah: potonganWajib,
        keterangan: `Autodebet panen ${data.komoditas} (${data.beratKg} Kg x Rp ${tarifWajib})`,
        metode: 'Potongan Panen'
      };

      setSavingsCashflow(prev => [cfSukarela, cfWajib, ...prev]);
    }

    tambahNotifikasi({
      judul: 'Transaksi Panen Diproses',
      pesan: `Panen ${data.komoditas} ${data.beratKg} Kg dari ${namaAnggota} diproses. Bersih: Rp ${totalBersihPetani.toLocaleString('id-ID')}, Tabungan bertambah: Rp ${totalPotongan.toLocaleString('id-ID')}.`,
      tipe: 'panen',
      targetModul: 'agribisnis'
    });

    showToast(
      'Transaksi Panen Disimpan',
      `Penimbangan ${data.komoditas} (${data.beratKg} Kg) dari ${namaAnggota} disimpan. Potongan tabungan Rp ${totalPotongan.toLocaleString('id-ID')} masuk simpanan.`,
      'success'
    );

    return newPanen;
  };

  // Hapus Transaksi Panen dengan Hitung Ulang & Sinkronisasi Otomatis
  const hapusTransaksiPanen = (id: string) => {
    const target = panenList.find(p => p.id === id);
    if (!target) return;

    // 1. Revert member savings
    if (target.anggotaId) {
      const anggota = anggotaList.find(a => a.id === target.anggotaId);
      if (anggota) {
        updateAnggota(anggota.id, {
          simpananSukarela: Math.max(0, anggota.simpananSukarela - target.potonganSukarela),
          simpananWajib: Math.max(0, anggota.simpananWajib - target.potonganWajib)
        });
      }
    }

    // 2. Remove related savingsCashflow entries
    setSavingsCashflow(prev =>
      prev.filter(cf => !(cf.anggotaId === target.anggotaId && cf.keterangan.includes(target.komoditas)))
    );

    // 3. Remove transaction from panenList (this triggers automatic recalculation in hitungStatistikKeuangan)
    setPanenList(prev => prev.filter(p => p.id !== id));

    showToast(
      'Transaksi Panen Dihapus & Disinkronkan',
      `Nota ${target.kodeNota} (${target.komoditas}) dihapus. Saldo simpanan dan seluruh laporan keuangan diperbarui secara otomatis.`,
      'delete'
    );
  };

  // Informasi Budidaya Anggota Methods
  const tambahLaporanBudidaya = (data: Omit<BudidayaReport, 'id' | 'kodeLaporan' | 'tanggalLaporan' | 'tanggalUpdate'>): BudidayaReport => {
    const today = new Date().toISOString().split('T')[0];
    const kodeLaporan = `BDY-${new Date().getFullYear()}-${String(budidayaReports.length + 1).padStart(3, '0')}`;
    const newReport: BudidayaReport = {
      ...data,
      id: `bdy-${Date.now()}`,
      kodeLaporan,
      tanggalLaporan: today,
      tanggalUpdate: today
    };

    setBudidayaReports(prev => [newReport, ...prev]);

    tambahNotifikasi({
      judul: 'Laporan Budidaya Masuk',
      pesan: `${data.namaPetani} memperbarui laporan garapan ${data.jenisKomoditas} (${data.tahapAktivitas}).`,
      tipe: 'info',
      targetModul: 'budidaya'
    });

    showToast(
      'Laporan Budidaya Disimpan',
      `Laporan budidaya ${data.jenisKomoditas} oleh ${data.namaPetani} berhasil tersimpan ke sistem.`,
      'success'
    );

    return newReport;
  };

  const updateLaporanBudidaya = (id: string, data: Partial<BudidayaReport>) => {
    const today = new Date().toISOString().split('T')[0];
    setBudidayaReports(prev =>
      prev.map(r => (r.id === id ? { ...r, ...data, tanggalUpdate: today } : r))
    );
    showToast('Laporan Budidaya Diperbarui', 'Pembaruan data budidaya berhasil disimpan.', 'success');
  };

  const hapusLaporanBudidaya = (id: string) => {
    const target = budidayaReports.find(r => r.id === id);
    setBudidayaReports(prev => prev.filter(r => r.id !== id));
    showToast('Laporan Dihapus', `Data budidaya ${target?.kodeLaporan || ''} telah dihapus.`, 'delete');
  };

  const bagikanFormBudidaya = (targetOption: 'semua' | 'whatsapp', pesanKhusus?: string) => {
    tambahNotifikasi({
      judul: 'Formulir Budidaya Dibagikan',
      pesan: `Pengurus koperasi telah menyebarkan tautan formulir perkembangan budidaya ke seluruh 93 petani mitra.`,
      tipe: 'info',
      targetModul: 'budidaya'
    });
    showToast(
      'Form Budidaya Berhasil Dibagikan',
      'Tautan formulir digital dan pemberitahuan telah disinkronkan ke seluruh akun petani mitra.',
      'success'
    );
  };
  const tambahBarangSaprodi = (data: Omit<SaprodiItem, 'id' | 'margin' | 'marginPersen' | 'tanggalUpdate'>) => {
    const margin = data.hargaJual - data.hargaBeli;
    const marginPersen = data.hargaBeli > 0 ? Number(((margin / data.hargaBeli) * 100).toFixed(2)) : 0;
    const today = new Date().toISOString().split('T')[0];

    const newItem: SaprodiItem = {
      ...data,
      id: `sap-${Date.now()}`,
      margin,
      marginPersen,
      tanggalUpdate: today
    };

    setSaprodiItems(prev => [newItem, ...prev]);

    // Check low stock
    if (newItem.stok <= newItem.stokMinimal) {
      tambahNotifikasi({
        judul: 'Peringatan Stok Saprodi Menipis',
        pesan: `Stok ${newItem.namaBarang} tersisa ${newItem.stok} ${newItem.satuan} (Batas minimum: ${newItem.stokMinimal}). Harap segera lakukan restock.`,
        tipe: 'stok',
        targetModul: 'saprodi'
      });
    }

    showToast('Barang Saprodi Ditambahkan', `Barang "${newItem.namaBarang}" berhasil dimasukkan ke inventaris toko.`, 'success');
  };

  const updateBarangSaprodi = (id: string, data: Partial<SaprodiItem>) => {
    setSaprodiItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const hargaBeli = data.hargaBeli !== undefined ? data.hargaBeli : item.hargaBeli;
          const hargaJual = data.hargaJual !== undefined ? data.hargaJual : item.hargaJual;
          const margin = hargaJual - hargaBeli;
          const marginPersen = hargaBeli > 0 ? Number(((margin / hargaBeli) * 100).toFixed(2)) : 0;
          const updated = {
            ...item,
            ...data,
            margin,
            marginPersen,
            tanggalUpdate: new Date().toISOString().split('T')[0]
          };

          // Warn if below min stock
          if (updated.stok <= updated.stokMinimal && updated.stok < item.stok) {
            tambahNotifikasi({
              judul: 'Peringatan Stok Saprodi Menipis',
              pesan: `Stok ${updated.namaBarang} tersisa ${updated.stok} ${updated.satuan}.`,
              tipe: 'stok',
              targetModul: 'saprodi'
            });
          }

          return updated;
        }
        return item;
      })
    );
    showToast('Inventaris Saprodi Disimpan', 'Stok dan harga barang saprodi berhasil diperbarui.', 'success');
  };

  const hapusBarangSaprodi = (id: string) => {
    const target = saprodiItems.find(s => s.id === id);
    const nama = target ? target.namaBarang : 'Barang';
    setSaprodiItems(prev => prev.filter(item => item.id !== id));
    showToast('Barang Saprodi Dihapus', `${nama} telah dihapus dari inventaris toko.`, 'delete');
  };

  const tambahArusKasSaprodi = (data: Omit<SaprodiCashFlow, 'id' | 'tanggal'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newCF: SaprodiCashFlow = {
      ...data,
      id: `scf-${Date.now()}`,
      tanggal: today
    };
    setSaprodiCashflow(prev => [newCF, ...prev]);
    showToast('Arus Kas Toko Disimpan', `Transaksi kas ${data.tipe} Rp ${data.jumlah.toLocaleString('id-ID')} dicatat.`, 'success');
  };

  const tambahTransaksiSaprodi = (data: {
    tipe: 'Penjualan' | 'Pembelian';
    barangId: string;
    jumlah: number;
    hargaSatuan: number;
    namaPihak: string;
    tipePihak: 'Anggota' | 'Non-Anggota' | 'Supplier / Distributor';
    anggotaId?: string;
    noHp?: string;
    metodePembayaran: 'Tunai' | 'Transfer Bank' | 'Potong Simpanan Sukarela';
    catatan?: string;
    updateHargaBeliMaster?: boolean;
  }): SaprodiTransaction => {
    const today = new Date().toISOString().split('T')[0];
    const item = saprodiItems.find(i => i.id === data.barangId);
    if (!item) {
      throw new Error('Barang tidak ditemukan di inventaris saprodi.');
    }

    const totalBiaya = data.hargaSatuan * data.jumlah;
    const kodeTransaksi = `TRX-SPD-${Date.now().toString().slice(-6)}`;

    let margin = 0;
    let danaTaktis = 0;

    if (data.tipe === 'Penjualan') {
      margin = Math.max(0, (data.hargaSatuan - item.hargaBeli) * data.jumlah);
      danaTaktis = Math.round(margin * 0.10);

      // Kurangi stok barang
      const newStock = Math.max(0, item.stok - data.jumlah);
      updateBarangSaprodi(item.id, { stok: newStock });

      // Catat arus kas pemasukan
      const cashflowEntry: SaprodiCashFlow = {
        id: `scf-${Date.now()}`,
        tanggal: today,
        tipe: 'Pemasukan',
        kategori: 'Penjualan Barang',
        keterangan: `Penjualan ${data.jumlah} ${item.satuan} ${item.namaBarang} (${data.namaPihak})`,
        jumlah: totalBiaya,
        referensi: kodeTransaksi
      };
      setSaprodiCashflow(prev => [cashflowEntry, ...prev]);

      // Potong simpanan sukarela jika dipilih dan anggota valid
      if (data.metodePembayaran === 'Potong Simpanan Sukarela' && data.anggotaId) {
        setAnggotaList(prev => prev.map(a => {
          if (a.id === data.anggotaId) {
            return {
              ...a,
              simpananSukarela: Math.max(0, a.simpananSukarela - totalBiaya)
            };
          }
          return a;
        }));

        const savingsEntry: SavingsCashFlow = {
          id: `sav-${Date.now()}`,
          tanggal: today,
          anggotaId: data.anggotaId,
          namaAnggota: data.namaPihak,
          jenisSimpanan: 'Simpanan Sukarela',
          tipe: 'Keluar',
          jumlah: totalBiaya,
          keterangan: `Pembelian Saprodi: ${data.jumlah} ${item.satuan} ${item.namaBarang} (No. Trx ${kodeTransaksi})`,
          metode: 'Potong Simpanan Sukarela'
        };
        setSavingsCashflow(prev => [savingsEntry, ...prev]);
      }

      // Notifikasi jika stok menipis
      if (newStock <= item.stokMinimal) {
        tambahNotifikasi({
          judul: 'Peringatan Stok Saprodi Menipis',
          pesan: `Stok ${item.namaBarang} kini tersisa ${newStock} ${item.satuan} setelah penjualan. Segera lakukan pemesanan ulang/restock.`,
          tipe: 'stok',
          targetModul: 'saprodi'
        });
      }

      showToast(
        'Penjualan Saprodi Berhasil',
        `${data.jumlah} ${item.satuan} ${item.namaBarang} terjual ke ${data.namaPihak} (Rp ${totalBiaya.toLocaleString('id-ID')}).`,
        'success'
      );
    } else {
      // Pembelian / Restock dari Supplier
      const newStock = item.stok + data.jumlah;
      const updateData: Partial<SaprodiItem> = { stok: newStock };
      if (data.updateHargaBeliMaster) {
        updateData.hargaBeli = data.hargaSatuan;
      }
      updateBarangSaprodi(item.id, updateData);

      // Catat arus kas pengeluaran
      const cashflowEntry: SaprodiCashFlow = {
        id: `scf-${Date.now()}`,
        tanggal: today,
        tipe: 'Pengeluaran',
        kategori: 'Restock / Pembelian',
        keterangan: `Restock ${data.jumlah} ${item.satuan} ${item.namaBarang} dari ${data.namaPihak}`,
        jumlah: totalBiaya,
        referensi: kodeTransaksi
      };
      setSaprodiCashflow(prev => [cashflowEntry, ...prev]);

      showToast(
        'Restock Pembelian Berhasil',
        `Stok ${item.namaBarang} bertambah +${data.jumlah} ${item.satuan} dari ${data.namaPihak}.`,
        'success'
      );
    }

    const newTrx: SaprodiTransaction = {
      id: `strx-${Date.now()}`,
      kodeTransaksi,
      tanggal: today,
      tipe: data.tipe,
      barangId: item.id,
      kodeBarang: item.kodeBarang,
      namaBarang: item.namaBarang,
      kategoriBarang: item.kategori,
      satuan: item.satuan,
      jumlah: data.jumlah,
      hargaSatuan: data.hargaSatuan,
      totalBiaya,
      margin: data.tipe === 'Penjualan' ? margin : undefined,
      danaTaktis: data.tipe === 'Penjualan' ? danaTaktis : undefined,
      namaPihak: data.namaPihak,
      tipePihak: data.tipePihak,
      anggotaId: data.anggotaId,
      noHp: data.noHp,
      metodePembayaran: data.metodePembayaran,
      catatan: data.catatan
    };

    setSaprodiTransactions(prev => [newTrx, ...prev]);
    return newTrx;
  };

  const hapusTransaksiSaprodi = (id: string) => {
    const target = saprodiTransactions.find(t => t.id === id);
    if (!target) return;

    // 1. Revert stock
    const item = saprodiItems.find(s => s.id === target.barangId);
    if (item) {
      if (target.tipe === 'Penjualan') {
        updateBarangSaprodi(item.id, { stok: item.stok + target.jumlah });
      } else {
        updateBarangSaprodi(item.id, { stok: Math.max(0, item.stok - target.jumlah) });
      }
    }

    // 2. Remove related saprodi cashflow
    setSaprodiCashflow(prev => prev.filter(cf => cf.referensi !== target.kodeTransaksi));

    // 3. If paid via Potong Simpanan Sukarela, restore member's balance
    if (target.metodePembayaran === 'Potong Simpanan Sukarela' && target.anggotaId) {
      const anggota = anggotaList.find(a => a.id === target.anggotaId);
      if (anggota) {
        updateAnggota(anggota.id, {
          simpananSukarela: anggota.simpananSukarela + target.totalBiaya
        });
      }
      setSavingsCashflow(prev => prev.filter(cf => !cf.keterangan.includes(target.kodeTransaksi)));
    }

    // 4. Remove transaction (triggers instant auto recalculation)
    setSaprodiTransactions(prev => prev.filter(t => t.id !== id));

    showToast(
      'Transaksi Saprodi Dihapus & Disinkronkan',
      `Transaksi ${target.kodeTransaksi} (${target.namaBarang}) dihapus. Stok, arus kas, dan pos laba rugi disinkronkan otomatis.`,
      'delete'
    );
  };

  // Alsintan
  const tambahAlsintan = (data: Omit<AlsintanItem, 'id'>) => {
    const newItem: AlsintanItem = {
      ...data,
      id: `als-${Date.now()}`
    };
    setAlsintanItems(prev => [newItem, ...prev]);
    showToast('Alsintan Ditambahkan', `Unit ${newItem.namaAlat} (${newItem.kodeAlat}) berhasil didaftarkan.`, 'success');
  };

  const updateAlsintan = (id: string, data: Partial<AlsintanItem>) => {
    setAlsintanItems(prev =>
      prev.map(a => (a.id === id ? { ...a, ...data } : a))
    );
    showToast('Alsintan Diperbarui', 'Pembaruan data/status alsintan berhasil disimpan.', 'success');
  };

  const hapusAlsintan = (id: string) => {
    const target = alsintanItems.find(a => a.id === id);
    const nama = target ? target.namaAlat : 'Alsintan';
    setAlsintanItems(prev => prev.filter(a => a.id !== id));
    showToast('Alsintan Dihapus', `${nama} telah dihapus dari inventaris alat & mesin koperasi.`, 'delete');
  };

  const tambahSewaAlsintan = (data: {
    alsintanId: string;
    anggotaId: string;
    durasi: number;
    satuanDurasi: 'Hari' | 'Jam';
  }) => {
    const alat = alsintanItems.find(a => a.id === data.alsintanId);
    const anggota = anggotaList.find(a => a.id === data.anggotaId);
    if (!alat || !anggota) return;

    const tarifSatuan = data.satuanDurasi === 'Hari' ? alat.hargaSewaHari : alat.hargaSewaJam;
    const totalBiaya = tarifSatuan * data.durasi;
    const today = new Date().toISOString().split('T')[0];
    const kodeSewa = `SW-ALT-${Date.now().toString().slice(-4)}`;

    const newRental: AlsintanRental = {
      id: `rnt-${Date.now()}`,
      kodeSewa,
      tanggal: today,
      alsintanId: alat.id,
      namaAlat: alat.namaAlat,
      anggotaId: anggota.id,
      namaPenyewa: anggota.nama,
      kontak: anggota.noHp,
      durasi: data.durasi,
      satuanDurasi: data.satuanDurasi,
      tarifSatuan,
      totalBiaya,
      status: 'Aktif'
    };

    setAlsintanRentals(prev => [newRental, ...prev]);
    updateAlsintan(alat.id, { status: 'Disewa' });

    tambahNotifikasi({
      judul: 'Penyewaan Alsintan Baru',
      pesan: `${anggota.nama} menyewa ${alat.namaAlat} untuk ${data.durasi} ${data.satuanDurasi}. Total biaya sewa: Rp ${totalBiaya.toLocaleString('id-ID')}.`,
      tipe: 'keuangan',
      targetModul: 'alsintan'
    });

    showToast('Sewa Alsintan Disimpan', `Penyewaan ${alat.namaAlat} oleh ${anggota.nama} (${data.durasi} ${data.satuanDurasi}) dicatat. Total biaya Rp ${totalBiaya.toLocaleString('id-ID')}.`, 'success');
  };

  const selesaikanSewaAlsintan = (rentalId: string) => {
    const rental = alsintanRentals.find(r => r.id === rentalId);
    if (!rental) return;

    const today = new Date().toISOString().split('T')[0];
    setAlsintanRentals(prev =>
      prev.map(r => (r.id === rentalId ? { ...r, status: 'Selesai', tanggalSelesai: today } : r))
    );

    updateAlsintan(rental.alsintanId, { status: 'Tersedia' });
    showToast('Sewa Selesai', `Penyewaan ${rental.namaAlat} telah selesai, unit kini tersedia kembali.`, 'success');
  };

  const hapusSewaAlsintan = (rentalId: string) => {
    const rental = alsintanRentals.find(r => r.id === rentalId);
    if (!rental) return;

    if (rental.status === 'Aktif') {
      updateAlsintan(rental.alsintanId, { status: 'Tersedia' });
    }

    setAlsintanRentals(prev => prev.filter(r => r.id !== rentalId));

    showToast(
      'Sewa Alsintan Dihapus & Disinkronkan',
      `Sewa ${rental.kodeSewa} (${rental.namaAlat}) dihapus. Pos pendapatan sewa dan SHU diperbarui otomatis.`,
      'delete'
    );
  };

  // Brilink
  const tambahTransaksiBrilink = (data: Omit<BrilinkTransaction, 'id' | 'kodeTransaksi' | 'tanggal'>) => {
    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const kodeTransaksi = `BRL-${Date.now().toString().slice(-6)}`;

    const newTrx: BrilinkTransaction = {
      ...data,
      id: `brl-${Date.now()}`,
      kodeTransaksi,
      tanggal: dateStr
    };

    setBrilinkList(prev => [newTrx, ...prev]);
    showToast('Transaksi Brilink Disimpan', `${data.tipe} Rp ${data.nominal.toLocaleString('id-ID')} berhasil disimpan. Fee kas: Rp ${data.feeAdmin.toLocaleString('id-ID')}.`, 'success');
  };

  const hapusTransaksiBrilink = (id: string) => {
    const target = brilinkList.find(b => b.id === id);
    if (!target) return;

    setBrilinkList(prev => prev.filter(b => b.id !== id));

    showToast(
      'Transaksi BRILink Dihapus & Disinkronkan',
      `Transaksi ${target.kodeTransaksi} (${target.tipe}) dihapus. Fee kas dan laporan keuangan diperbarui otomatis.`,
      'delete'
    );
  };

  // Loan Application with strictly enforced 2x savings validation
  const ajukanPinjaman = (data: {
    anggotaId: string;
    jumlahPinjaman: number;
    tenorBulan: number;
    tujuanPinjaman: string;
  }): { success: boolean; message: string; loan?: LoanApplication } => {
    const anggota = anggotaList.find(a => a.id === data.anggotaId);
    if (!anggota) {
      showToast('Pengajuan Gagal', 'Data anggota tidak ditemukan.', 'warning');
      return { success: false, message: 'Data anggota tidak ditemukan.' };
    }

    if (anggota.status !== 'Aktif') {
      showToast('Pengajuan Ditolak', 'Hanya anggota AKTIF yang dapat mengajukan pinjaman.', 'warning');
      return { success: false, message: 'Hanya anggota berstatus AKTIF yang dapat mengajukan pinjaman.' };
    }

    const totalSimpanan = anggota.simpananPokok + anggota.simpananWajib + anggota.simpananSukarela;
    const plafonMaksimal = totalSimpanan * 2;

    // Strict validation: maksimal 2x dari total simpanan
    if (data.jumlahPinjaman > plafonMaksimal) {
      const msg = `Pengajuan melebihi plafon! Maksimal pinjaman adalah 2x total simpanan (Rp ${plafonMaksimal.toLocaleString('id-ID')}). Total simpanan anggota saat ini adalah Rp ${totalSimpanan.toLocaleString('id-ID')}.`;
      showToast('Pengajuan Melebihi Plafon', msg, 'warning');
      return {
        success: false,
        message: msg
      };
    }

    const bungaPersenPerBulan = 1.0; // 1% flat jasa koperasi per bulan
    const pokokBulanan = data.jumlahPinjaman / data.tenorBulan;
    const jasaBulanan = data.jumlahPinjaman * (bungaPersenPerBulan / 100);
    const cicilanBulanan = Math.round(pokokBulanan + jasaBulanan);

    const today = new Date().toISOString().split('T')[0];
    const kodePinjaman = `PINJ-${Date.now().toString().slice(-6)}`;

    const newLoan: LoanApplication = {
      id: `ln-${Date.now()}`,
      kodePinjaman,
      tanggalPengajuan: today,
      anggotaId: anggota.id,
      namaAnggota: anggota.nama,
      noHp: anggota.noHp,
      totalSimpananSaatIni: totalSimpanan,
      plafonMaksimal,
      jumlahPinjaman: data.jumlahPinjaman,
      tenorBulan: data.tenorBulan,
      bungaPersenPerBulan,
      cicilanBulanan,
      tujuanPinjaman: data.tujuanPinjaman,
      status: 'Menunggu Persetujuan',
      sisaPinjaman: data.jumlahPinjaman
    };

    setLoans(prev => [newLoan, ...prev]);

    tambahNotifikasi({
      judul: 'Pengajuan Pinjaman Baru',
      pesan: `${anggota.nama} mengajukan pinjaman Rp ${data.jumlahPinjaman.toLocaleString('id-ID')} (${data.tenorBulan} bulan). Memerlukan persetujuan pengurus.`,
      tipe: 'pinjaman',
      targetModul: 'pinjaman'
    });

    showToast('Pinjaman Berhasil Diajukan', `Pinjaman Rp ${data.jumlahPinjaman.toLocaleString('id-ID')} oleh ${anggota.nama} berhasil diajukan dan memenuhi plafon 2x simpanan.`, 'success');

    return {
      success: true,
      message: 'Pengajuan pinjaman berhasil diajukan dan memenuhi syarat plafon 2x simpanan.',
      loan: newLoan
    };
  };

  const verifikasiPinjaman = (loanId: string, status: 'Disetujui' | 'Ditolak') => {
    const today = new Date().toISOString().split('T')[0];
    setLoans(prev =>
      prev.map(l => (l.id === loanId ? { ...l, status, tanggalDisetujui: today } : l))
    );

    const loan = loans.find(l => l.id === loanId);
    if (loan) {
      tambahNotifikasi({
        judul: `Pinjaman ${status}`,
        pesan: `Pengajuan pinjaman ${loan.kodePinjaman} oleh ${loan.namaAnggota} telah ${status.toLowerCase()} oleh Pengurus.`,
        tipe: 'pinjaman',
        targetModul: 'pinjaman'
      });
      showToast(`Pinjaman ${status}`, `Pengajuan ${loan.kodePinjaman} (${loan.namaAnggota}) telah ${status.toLowerCase()}.`, status === 'Disetujui' ? 'success' : 'delete');
    }
  };

  const cairkanPinjaman = (loanId: string) => {
    const today = new Date().toISOString().split('T')[0];
    setLoans(prev =>
      prev.map(l => (l.id === loanId ? { ...l, status: 'Dicairkan', tanggalDicairkan: today } : l))
    );

    const loan = loans.find(l => l.id === loanId);
    if (loan) {
      tambahNotifikasi({
        judul: 'Pencairan Pinjaman Berhasil',
        pesan: `Dana pinjaman sebesar Rp ${loan.jumlahPinjaman.toLocaleString('id-ID')} telah dicairkan kepada ${loan.namaAnggota}.`,
        tipe: 'keuangan',
        targetModul: 'pinjaman'
      });
      showToast('Pinjaman Dicairkan', `Dana pinjaman Rp ${loan.jumlahPinjaman.toLocaleString('id-ID')} berhasil dicairkan kepada ${loan.namaAnggota}.`, 'success');
    }
  };

  const hapusPinjaman = (loanId: string) => {
    const target = loans.find(l => l.id === loanId);
    if (!target) return;

    setLoans(prev => prev.filter(l => l.id !== loanId));

    showToast(
      'Berkas Pinjaman Dihapus & Disinkronkan',
      `Pinjaman ${target.kodePinjaman} (${target.namaAnggota}) dihapus. Pos pinjaman berjalan dan jasa koperasi diperbarui otomatis.`,
      'delete'
    );
  };

  const bayarAngsuranPinjaman = (loanId: string, jumlahAngsuran: number, metode: string = 'Tunai') => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;

    const currentSisa = loan.sisaPinjaman !== undefined ? loan.sisaPinjaman : loan.jumlahPinjaman;
    const sisaBaru = Math.max(0, currentSisa - jumlahAngsuran);
    const statusBaru = sisaBaru === 0 ? 'Lunas' : loan.status;

    setLoans(prev =>
      prev.map(l => (l.id === loanId ? { ...l, sisaPinjaman: sisaBaru, status: statusBaru } : l))
    );

    showToast(
      'Angsuran Diterima & Disinkronkan',
      `Pembayaran angsuran Rp ${jumlahAngsuran.toLocaleString('id-ID')} (${metode}) untuk ${loan.kodePinjaman} berhasil dicatat. Sisa pinjaman: Rp ${sisaBaru.toLocaleString('id-ID')}.`,
      'success'
    );
  };

  // Savings & Cash Flow Manual
  const tambahSimpananManual = (data: {
    anggotaId: string;
    jenisSimpanan: 'Simpanan Pokok' | 'Simpanan Wajib' | 'Simpanan Sukarela' | 'Penyertaan Modal Ketahanan Pangan';
    tipe: 'Masuk' | 'Keluar';
    jumlah: number;
    keterangan: string;
    metode: 'Tunai' | 'Potongan Panen' | 'Transfer';
  }) => {
    const anggota = anggotaList.find(a => a.id === data.anggotaId);
    const namaAnggota = anggota ? anggota.nama : 'Anggota Koperasi';
    const today = new Date().toISOString().split('T')[0];

    const newCF: SavingsCashFlow = {
      id: `sav-${Date.now()}`,
      tanggal: today,
      anggotaId: data.anggotaId,
      namaAnggota,
      jenisSimpanan: data.jenisSimpanan,
      tipe: data.tipe,
      jumlah: data.jumlah,
      keterangan: data.keterangan,
      metode: data.metode
    };

    setSavingsCashflow(prev => [newCF, ...prev]);

    // Update individual balance if it's an existing member
    if (anggota) {
      const multiplier = data.tipe === 'Masuk' ? 1 : -1;
      const delta = data.jumlah * multiplier;

      if (data.jenisSimpanan === 'Simpanan Pokok') {
        updateAnggota(anggota.id, { simpananPokok: Math.max(0, anggota.simpananPokok + delta) });
      } else if (data.jenisSimpanan === 'Simpanan Wajib') {
        updateAnggota(anggota.id, { simpananWajib: Math.max(0, anggota.simpananWajib + delta) });
      } else if (data.jenisSimpanan === 'Simpanan Sukarela') {
        updateAnggota(anggota.id, { simpananSukarela: Math.max(0, anggota.simpananSukarela + delta) });
      }
    }

    showToast(
      'Transaksi Simpanan Berhasil',
      `${data.jenisSimpanan} (${data.tipe}) Rp ${data.jumlah.toLocaleString('id-ID')} untuk ${namaAnggota} dicatat.`,
      'success'
    );
  };

  const hapusSimpananCashflow = (id: string) => {
    const target = savingsCashflow.find(s => s.id === id);
    if (!target) return;

    // Reverse effect on member's balance
    if (target.anggotaId) {
      const anggota = anggotaList.find(a => a.id === target.anggotaId);
      if (anggota) {
        const multiplier = target.tipe === 'Masuk' ? -1 : 1; // reversing the transaction!
        const delta = target.jumlah * multiplier;

        if (target.jenisSimpanan === 'Simpanan Pokok') {
          updateAnggota(anggota.id, { simpananPokok: Math.max(0, anggota.simpananPokok + delta) });
        } else if (target.jenisSimpanan === 'Simpanan Wajib') {
          updateAnggota(anggota.id, { simpananWajib: Math.max(0, anggota.simpananWajib + delta) });
        } else if (target.jenisSimpanan === 'Simpanan Sukarela') {
          updateAnggota(anggota.id, { simpananSukarela: Math.max(0, anggota.simpananSukarela + delta) });
        }
      }
    }

    setSavingsCashflow(prev => prev.filter(s => s.id !== id));

    showToast(
      'Arus Kas Simpanan Dihapus & Dihitung Ulang',
      `Simpanan ${target.jenisSimpanan} (${target.namaAnggota}) dihapus. Saldo anggota dan seluruh rekapitulasi keuangan disinkronkan otomatis.`,
      'delete'
    );
  };

  const updateOperationalExpense = (data: Partial<OperationalExpense>) => {
    setOperationalExpense(prev => ({ ...prev, ...data }));
    showToast('Biaya Operasional Diperbarui', 'Alokasi pengeluaran dan modal ketahanan pangan berhasil disimpan.', 'success');
  };

  // Hitung Laba Rugi & Indikator Finansial Lengkap
  const hitungStatistikKeuangan = () => {
    // 1. Anggota
    const totalAnggotaAktif = anggotaList.filter(a => a.status === 'Aktif').length;
    const totalAnggotaNonAktif = anggotaList.filter(a => a.status === 'Non-Aktif').length;

    // 2. Simpanan
    const totalSimpananPokok = anggotaList.reduce((sum, a) => sum + (a.simpananPokok || 0), 0);
    const totalSimpananWajib = anggotaList.reduce((sum, a) => sum + (a.simpananWajib || 0), 0);
    const totalSimpananSukarela = anggotaList.reduce((sum, a) => sum + (a.simpananSukarela || 0), 0);
    const totalModalKetahananPangan = operationalExpense.penyertaanModalPangan || 0;
    const totalAkumulasiSimpanan = totalSimpananPokok + totalSimpananWajib + totalSimpananSukarela + totalModalKetahananPangan;

    // 3. Pinjaman Berjalan
    const totalPinjamanBerjalan = loans
      .filter(l => l.status === 'Dicairkan')
      .reduce((sum, l) => sum + l.sisaPinjaman, 0);

    // 4. Pendapatan Kotor (Bruto) dari seluruh unit
    // A. Agribisnis Sayuran
    const pendapatanSharingProfitSayuran = panenList
      .filter(p => p.tipePenjualan === 'Koperasi Mandiri')
      .reduce((sum, p) => sum + p.sharingProfitKoperasi, 0);

    const pendapatanBumdesSayuran = panenList
      .filter(p => p.tipePenjualan === 'BUMDes')
      .reduce((sum, p) => sum + p.sharingProfitKoperasi, 0);

    // B. Toko Saprodi (Setelah dikurangi Dana Taktis 10%)
    // Pemasukan dari penjualan barang saprodi
    const totalPemasukanSaprodi = saprodiCashflow
      .filter(cf => cf.tipe === 'Pemasukan' && cf.kategori === 'Penjualan Barang')
      .reduce((sum, cf) => sum + cf.jumlah, 0);

    // Margin estimasi penjualan toko saprodi
    const estimasiMarginSaprodi = totalPemasukanSaprodi * 0.12; // rata-rata margin 12%
    const pendapatanSaprodiKotor = estimasiMarginSaprodi > 0 ? estimasiMarginSaprodi : 2800000;
    // Ketentuan: Otomatis dipotong Dana Taktis 10%
    const danaTaktisSaprodi10Persen = pendapatanSaprodiKotor * 0.10;
    const pendapatanSaprodiNetto = pendapatanSaprodiKotor - danaTaktisSaprodi10Persen;

    // C. Alsintan (Total pendapatan sewa)
    const pendapatanSewaAlsintan = alsintanRentals
      .filter(r => r.status === 'Selesai' || r.status === 'Aktif')
      .reduce((sum, r) => sum + r.totalBiaya, 0);

    // D. Brilink (Fee Admin)
    const pendapatanFeeBrilink = brilinkList
      .filter(b => b.status === 'Berhasil')
      .reduce((sum, b) => sum + b.feeAdmin, 0);

    // E. Simpan Pinjam (Jasa Bunga 1% per bulan dari pinjaman aktif)
    const pendapatanJasaPinjaman = loans
      .filter(l => l.status === 'Dicairkan')
      .reduce((sum, l) => sum + (l.jumlahPinjaman * (l.bungaPersenPerBulan / 100)), 0);

    // Total Bruto
    const totalPendapatanBruto =
      pendapatanSharingProfitSayuran +
      pendapatanBumdesSayuran +
      pendapatanSaprodiNetto +
      pendapatanSewaAlsintan +
      pendapatanFeeBrilink +
      pendapatanJasaPinjaman;

    // Pengurangan Operasional Bulanan
    const totalOperasionalBulanan =
      (operationalExpense.gajiPegawai || 0) +
      (operationalExpense.sewaTempat || 0) +
      (operationalExpense.listrikDanAir || 0) +
      (operationalExpense.biayaOperasionalLain || 0);

    // Pendapatan Bersih (Netto Sebelum Zakat)
    const pendapatanBersihSebelumZakat = Math.max(0, totalPendapatanBruto - (totalOperasionalBulanan * 0.15)); // Proposional bulan berjalan atau bruto aktual

    // Potongan Zakat Koperasi: 2,5% dari Pendapatan Bersih
    const potonganZakat2_5 = Math.round(pendapatanBersihSebelumZakat * 0.025);

    // Total Pendapatan Bersih Bulanan (Setelah Zakat)
    const pendapatanBersihSetelahZakat = pendapatanBersihSebelumZakat - potonganZakat2_5;

    // Distribusi Keuntungan Bulanan
    // SHU: 35%
    const alokasiSHU35 = Math.round(pendapatanBersihSetelahZakat * 0.35);
    // Dana Pembinaan: 5%
    const alokasiPembinaan5 = Math.round(pendapatanBersihSetelahZakat * 0.05);
    // Biaya Operasional Pengurus (BOP): 30%
    const alokasiBOP30 = Math.round(pendapatanBersihSetelahZakat * 0.30);
    // Cadangan Kas Koperasi: 30%
    const alokasiCadangan30 = Math.round(pendapatanBersihSetelahZakat * 0.30);

    return {
      totalAnggotaAktif,
      totalAnggotaNonAktif,
      totalSimpananPokok,
      totalSimpananWajib,
      totalSimpananSukarela,
      totalModalKetahananPangan,
      totalAkumulasiSimpanan,
      totalPinjamanBerjalan,
      pendapatanSharingProfitSayuran,
      pendapatanBumdesSayuran,
      pendapatanSaprodiKotor,
      danaTaktisSaprodi10Persen,
      pendapatanSaprodiNetto,
      pendapatanSewaAlsintan,
      pendapatanFeeBrilink,
      pendapatanJasaPinjaman,
      totalPendapatanBruto,
      totalOperasionalBulanan,
      pendapatanBersihSebelumZakat,
      potonganZakat2_5,
      pendapatanBersihSetelahZakat,
      alokasiSHU35,
      alokasiPembinaan5,
      alokasiBOP30,
      alokasiCadangan30
    };
  };

  return (
    <KoperasiContext.Provider
      value={{
        anggotaList,
        tambahAnggota,
        updateAnggota,
        hapusAnggota,
        getNextNomorAnggota,
        commodityPrices,
        updateHargaKomoditas,
        budidayaReports,
        tambahLaporanBudidaya,
        updateLaporanBudidaya,
        hapusLaporanBudidaya,
        bagikanFormBudidaya,
        panenList,
        tambahTransaksiPanen,
        hapusTransaksiPanen,
        saprodiItems,
        tambahBarangSaprodi,
        updateBarangSaprodi,
        hapusBarangSaprodi,
        saprodiCashflow,
        tambahArusKasSaprodi,
        saprodiTransactions,
        tambahTransaksiSaprodi,
        hapusTransaksiSaprodi,
        alsintanItems,
        tambahAlsintan,
        updateAlsintan,
        hapusAlsintan,
        alsintanRentals,
        tambahSewaAlsintan,
        selesaikanSewaAlsintan,
        hapusSewaAlsintan,
        brilinkList,
        tambahTransaksiBrilink,
        hapusTransaksiBrilink,
        loans,
        ajukanPinjaman,
        verifikasiPinjaman,
        cairkanPinjaman,
        hapusPinjaman,
        bayarAngsuranPinjaman,
        savingsCashflow,
        tambahSimpananManual,
        hapusSimpananCashflow,
        operationalExpense,
        updateOperationalExpense,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        tambahNotifikasi,
        currentUser,
        setCurrentUserRole,
        usersList,
        supabaseConfig,
        updateSupabaseConfig,
        resetAllDataToDefault,
        hitungStatistikKeuangan,
        isAdminLoggedIn,
        isLoggedIn: isAdminLoggedIn,
        authType,
        activeAnggota,
        unlockedPinMemberIds,
        loginAdmin,
        logoutAdmin,
        loginAnggota,
        verifyMemberPin,
        isPinUnlockedFor,
        lockMemberPin,
        logout,
        toastList,
        showToast,
        dismissToast
      }}
    >
      {children}
    </KoperasiContext.Provider>
  );
};

export const useKoperasi = () => {
  const context = useContext(KoperasiContext);
  if (!context) {
    throw new Error('useKoperasi must be used within a KoperasiProvider');
  }
  return context;
};
